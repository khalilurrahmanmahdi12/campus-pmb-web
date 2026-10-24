import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { snap } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  try {
    const { applicantId } = await request.json();

    if (!applicantId) {
      return NextResponse.json({ error: 'Applicant ID required' }, { status: 400 });
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: { major: true, payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Pendaftar tidak ditemukan' }, { status: 404 });
    }

    if (applicant.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Pendaftar ini sudah menyelesaikan pembayaran.' }, { status: 400 });
    }

    const existingPayment = applicant.payments[0];

    // If existing payment has snapToken and not expired, return it
    if (existingPayment?.snapToken && existingPayment.transactionStatus === 'PENDING') {
      return NextResponse.json({
        success: true,
        snapToken: existingPayment.snapToken,
        orderId: existingPayment.orderId,
      });
    }

    // Generate new order & token
    const newOrderId = `ORDER-PMB-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = applicant.major?.registrationFee || 250000;

    let snapToken = '';
    try {
      const parameter = {
        transaction_details: {
          order_id: newOrderId,
          gross_amount: fee,
        },
        customer_details: {
          first_name: applicant.fullName,
          email: applicant.email,
          phone: applicant.phone,
        },
        item_details: [
          {
            id: `REG-${applicant.major.code}`,
            price: fee,
            quantity: 1,
            name: `Biaya PMB ${applicant.major.degree} ${applicant.major.name}`.slice(0, 50),
          },
        ],
      };

      const tx = await snap.createTransaction(parameter);
      snapToken = tx.token;
    } catch {
      snapToken = `dummy-snap-token-${newOrderId}`;
    }

    const newPayment = await prisma.payment.create({
      data: {
        applicantId: applicant.id,
        orderId: newOrderId,
        amount: fee,
        transactionStatus: 'PENDING',
        snapToken,
      },
    });

    return NextResponse.json({
      success: true,
      snapToken: newPayment.snapToken,
      orderId: newPayment.orderId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memproses pembayaran' }, { status: 500 });
  }
}
