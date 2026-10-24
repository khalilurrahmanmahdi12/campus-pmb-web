import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const applicant = await prisma.applicant.findUnique({
      where: { id },
      include: {
        major: {
          include: {
            faculty: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Data pendaftar tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: applicant,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
