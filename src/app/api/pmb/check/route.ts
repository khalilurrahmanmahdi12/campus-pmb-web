import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json({ error: 'Nomor Pendaftaran atau NIK diperlukan.' }, { status: 400 });
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        OR: [
          { registrationNo: query },
          { nik: query },
        ],
      },
      include: {
        major: {
          include: {
            faculty: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Data pendaftar tidak ditemukan. Periksa kembali Nomor Pendaftaran atau NIK Anda.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: applicant,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Terjadi kesalahan sistem.' }, { status: 500 });
  }
}
