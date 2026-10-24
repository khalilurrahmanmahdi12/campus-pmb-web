import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const admissionStatus = searchParams.get('admissionStatus') || '';
    const majorId = searchParams.get('majorId') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { registrationNo: { contains: search } },
        { nik: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    if (admissionStatus) {
      where.admissionStatus = admissionStatus;
    }

    if (majorId) {
      where.majorId = majorId;
    }

    const applicants = await prisma.applicant.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        major: {
          include: { faculty: true },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: applicants,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching applicants' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, paymentStatus, admissionStatus, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Applicant ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (admissionStatus) updateData.admissionStatus = admissionStatus;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.applicant.update({
      where: { id },
      data: updateData,
      include: { major: true },
    });

    // If admin manually sets payment to PAID, also mark latest pending payment as PAID
    if (paymentStatus === 'PAID') {
      const latestPayment = await prisma.payment.findFirst({
        where: { applicantId: id },
        orderBy: { createdAt: 'desc' },
      });

      if (latestPayment && latestPayment.transactionStatus !== 'PAID') {
        await prisma.payment.update({
          where: { id: latestPayment.id },
          data: {
            transactionStatus: 'PAID',
            paymentType: latestPayment.paymentType || 'manual_admin',
            paidAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status pendaftar berhasil diperbarui.',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error updating applicant' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID pendaftar diperlukan' }, { status: 400 });
    }

    await prisma.applicant.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Data pendaftar berhasil dihapus.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting applicant' }, { status: 500 });
  }
}
