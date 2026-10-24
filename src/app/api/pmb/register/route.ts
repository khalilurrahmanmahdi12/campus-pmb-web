import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { snap } from '@/lib/midtrans';
import { generateRegistrationNo, generateOrderId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      nik,
      email,
      phone,
      gender,
      birthPlace,
      birthDate,
      address,
      schoolOrigin,
      graduationYear,
      averageScore,
      majorId,
    } = body;

    // Validation
    if (!fullName || !nik || !email || !phone || !majorId) {
      return NextResponse.json(
        { error: 'Mohon lengkapi seluruh field wajib formulir pendaftaran!' },
        { status: 400 }
      );
    }

    // Check if NIK already registered
    const existingApplicant = await prisma.applicant.findUnique({
      where: { nik },
    });

    if (existingApplicant) {
      return NextResponse.json(
        {
          error: `NIK ${nik} sudah terdaftar dengan Nomor Pendaftaran: ${existingApplicant.registrationNo}`,
          registrationNo: existingApplicant.registrationNo,
          applicantId: existingApplicant.id,
        },
        { status: 409 }
      );
    }

    // Get selected Study Program to check fee
    const major = await prisma.studyProgram.findUnique({
      where: { id: majorId },
      include: { faculty: true },
    });

    if (!major) {
      return NextResponse.json(
        { error: 'Program Studi yang dipilih tidak ditemukan.' },
        { status: 404 }
      );
    }

    const registrationFee = major.registrationFee || 250000;
    const registrationNo = generateRegistrationNo();
    const orderId = generateOrderId();

    // Create applicant in database
    const applicant = await prisma.applicant.create({
      data: {
        registrationNo,
        fullName,
        nik,
        email,
        phone,
        gender: gender === 'PEREMPUAN' ? 'PEREMPUAN' : 'LAKI_LAKI',
        birthPlace: birthPlace || '-',
        birthDate: birthDate ? new Date(birthDate) : new Date(),
        address: address || '-',
        schoolOrigin: schoolOrigin || '-',
        graduationYear: parseInt(graduationYear) || new Date().getFullYear(),
        averageScore: parseFloat(averageScore) || 0,
        majorId: major.id,
        paymentStatus: 'PENDING',
        admissionStatus: 'MENUNGGU_VERIFIKASI',
      },
    });

    // Create Midtrans Snap Transaction parameters
    let snapToken = '';
    try {
      const parameter = {
        transaction_details: {
          order_id: orderId,
          gross_amount: registrationFee,
        },
        customer_details: {
          first_name: fullName,
          email: email,
          phone: phone,
          billing_address: {
            first_name: fullName,
            address: address,
          },
        },
        item_details: [
          {
            id: `REG-${major.code}`,
            price: registrationFee,
            quantity: 1,
            name: `Biaya PMB ${major.degree} ${major.name}`.slice(0, 50),
          },
        ],
      };

      const transaction = await snap.createTransaction(parameter);
      snapToken = transaction.token;
    } catch (midtransError: any) {
      console.error('Midtrans Snap Error (Fallback to simulation):', midtransError?.message || midtransError);
      // In case Midtrans keys are dummy or invalid, allow graceful token generation for dev/demo
      snapToken = `dummy-snap-token-${orderId}`;
    }

    // Save payment record
    await prisma.payment.create({
      data: {
        applicantId: applicant.id,
        orderId,
        amount: registrationFee,
        transactionStatus: 'PENDING',
        snapToken,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dibuat! Silakan lanjutkan pembayaran.',
      data: {
        applicantId: applicant.id,
        registrationNo: applicant.registrationNo,
        orderId,
        amount: registrationFee,
        snapToken,
      },
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan sistem saat mendaftar.' },
      { status: 500 }
    );
  }
}
