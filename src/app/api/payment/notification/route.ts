import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyMidtransSignature } from '@/lib/midtrans';

export async function POST(request: NextRequest) {
  try {
    const notificationJson = await request.json();
    console.log('⚡ Received Midtrans Webhook Notification:', JSON.stringify(notificationJson));

    const {
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
      payment_type: paymentType,
    } = notificationJson;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    // In production, signature verification is strongly advised:
    const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
    if (isProduction && signatureKey) {
      const isValid = verifyMidtransSignature(orderId, statusCode, grossAmount, signatureKey);
      if (!isValid) {
        console.warn('⚠️ Invalid Midtrans signature detected for order:', orderId);
        return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
      }
    }

    // Find payment record
    const payment = await prisma.payment.findUnique({
      where: { orderId },
      include: { applicant: true },
    });

    if (!payment) {
      console.warn(`Payment with orderId ${orderId} not found in database.`);
      return NextResponse.json({ message: 'Payment record not found' }, { status: 404 });
    }

    let updatedPaymentStatus: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED' | 'CANCELLED' = 'PENDING';

    // Midtrans Transaction Status Logic
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        updatedPaymentStatus = 'PENDING';
      } else if (fraudStatus === 'accept') {
        updatedPaymentStatus = 'PAID';
      }
    } else if (transactionStatus === 'settlement') {
      // Payment Successful (QRIS, VA, E-Wallet, etc.)
      updatedPaymentStatus = 'PAID';
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny'
    ) {
      updatedPaymentStatus = 'FAILED';
    } else if (transactionStatus === 'expire') {
      updatedPaymentStatus = 'EXPIRED';
    } else if (transactionStatus === 'pending') {
      updatedPaymentStatus = 'PENDING';
    }

    // Update payment record in database
    await prisma.payment.update({
      where: { orderId },
      data: {
        transactionStatus: updatedPaymentStatus,
        paymentType: paymentType || payment.paymentType,
        fraudStatus: fraudStatus || payment.fraudStatus,
        rawMidtransData: JSON.stringify(notificationJson),
        paidAt: updatedPaymentStatus === 'PAID' ? new Date() : payment.paidAt,
      },
    });

    // Update applicant payment status
    await prisma.applicant.update({
      where: { id: payment.applicantId },
      data: {
        paymentStatus: updatedPaymentStatus,
      },
    });

    console.log(`✅ Successfully updated payment & applicant for order ${orderId} to status: ${updatedPaymentStatus}`);

    return NextResponse.json({
      status: 'success',
      message: `Notification processed for order ${orderId}. Status: ${updatedPaymentStatus}`,
    });
  } catch (error: any) {
    console.error('Midtrans Webhook Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing Midtrans webhook' },
      { status: 500 }
    );
  }
}
