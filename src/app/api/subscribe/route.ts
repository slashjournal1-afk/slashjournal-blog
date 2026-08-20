import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { email, topic } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Alamat email tidak valid' }, { status: 400 });
    }

    await prisma.subscription.create({
      data: {
        email: email.toLowerCase().trim(),
        topic: topic || 'all',
      },
    });

    return NextResponse.json({ success: true, message: 'Berhasil berlangganan pembaruan!' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Gagal memproses langganan' }, { status: 500 });
  }
}
