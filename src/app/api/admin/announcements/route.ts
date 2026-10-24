import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') === 'true';

    const where: any = {};
    if (publishedOnly) where.isPublished = true;

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    });

    return NextResponse.json({ success: true, data: announcements });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const { title, content, category, isPublished } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Judul dan konten wajib diisi' }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

    const created = await prisma.announcement.create({
      data: {
        title,
        slug,
        content,
        category: category || 'INFO_PMB',
        isPublished: isPublished ?? true,
        authorId: admin.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Pengumuman berhasil dipublikasikan', data: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error creating announcement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID Pengumuman diperlukan' }, { status: 400 });

    await prisma.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Pengumuman berhasil dihapus' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error deleting announcement' }, { status: 500 });
  }
}
