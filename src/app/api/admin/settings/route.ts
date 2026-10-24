import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      data: settingsMap,
      midtransStatus: {
        isConfigured: !!process.env.MIDTRANS_SERVER_KEY && process.env.MIDTRANS_SERVER_KEY !== 'SB-Mid-server-YOUR_SANDBOX_SERVER_KEY',
        isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
        clientKey: process.env.MIDTRANS_CLIENT_KEY ? `${process.env.MIDTRANS_CLIENT_KEY.slice(0, 8)}...` : 'Belum diatur',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = getAdminFromRequest(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json(); // { CAMPUS_NAME: "...", ... }

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === 'string') {
        await prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Pengaturan berhasil disimpan!' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error saving settings' }, { status: 500 });
  }
}
