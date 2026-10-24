import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const totalApplicants = await prisma.applicant.count();
    const paidApplicants = await prisma.applicant.count({
      where: { paymentStatus: 'PAID' },
    });
    const pendingApplicants = await prisma.applicant.count({
      where: { paymentStatus: 'PENDING' },
    });
    const verifiedApplicants = await prisma.applicant.count({
      where: { admissionStatus: 'DIVERIFIKASI' },
    });
    const acceptedApplicants = await prisma.applicant.count({
      where: { admissionStatus: 'LULUS' },
    });

    // Total Revenue from successful payments
    const revenueAggregate = await prisma.payment.aggregate({
      where: { transactionStatus: 'PAID' },
      _sum: { amount: true },
    });
    const totalRevenue = revenueAggregate._sum.amount || 0;

    // Applicants grouped by Study Program
    const prodiStats = await prisma.studyProgram.findMany({
      select: {
        id: true,
        name: true,
        degree: true,
        code: true,
        capacity: true,
        _count: {
          select: { applicants: true },
        },
      },
    });

    // Recent 5 applicants
    const recentApplicants = await prisma.applicant.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        major: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalApplicants,
        paidApplicants,
        pendingApplicants,
        verifiedApplicants,
        acceptedApplicants,
        totalRevenue,
        prodiStats: prodiStats.map((p) => ({
          id: p.id,
          name: `${p.degree} ${p.name}`,
          code: p.code,
          capacity: p.capacity,
          applicantCount: p._count.applicants,
        })),
        recentApplicants,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching stats' }, { status: 500 });
  }
}
