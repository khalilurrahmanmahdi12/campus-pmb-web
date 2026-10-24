import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const prodis = await prisma.studyProgram.findMany({
      include: {
        faculty: true,
        _count: {
          select: { applicants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const faculties = await prisma.faculty.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: { prodis, faculties },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching study programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { name, degree, code, facultyId, accreditation, capacity, registrationFee, description } = body;

    if (!name || !code || !facultyId) {
      return NextResponse.json({ error: 'Nama, Kode, dan Fakultas wajib diisi.' }, { status: 400 });
    }

    const created = await prisma.studyProgram.create({
      data: {
        name,
        degree: degree || 'S1',
        code,
        facultyId,
        accreditation: accreditation || 'Baik',
        capacity: parseInt(capacity) || 100,
        registrationFee: parseInt(registrationFee) || 250000,
        description,
      },
      include: { faculty: true },
    });

    return NextResponse.json({ success: true, message: 'Program Studi berhasil ditambahkan', data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menambahkan prodi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { id, name, degree, code, facultyId, accreditation, capacity, registrationFee, description } = body;

    const updated = await prisma.studyProgram.update({
      where: { id },
      data: {
        name,
        degree,
        code,
        facultyId,
        accreditation,
        capacity: parseInt(capacity),
        registrationFee: parseInt(registrationFee),
        description,
      },
      include: { faculty: true },
    });

    return NextResponse.json({ success: true, message: 'Program Studi berhasil diperbarui', data: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal memperbarui prodi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID Prodi diperlukan' }, { status: 400 });

    await prisma.studyProgram.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Program Studi berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Gagal menghapus prodi' }, { status: 500 });
  }
}
