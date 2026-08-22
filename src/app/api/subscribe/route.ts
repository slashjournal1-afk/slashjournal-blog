import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jsonError } from '@/lib/api-errors';
import { subscriptionSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'subscribe'), 5, 3600_000)) return NextResponse.json({ error: 'Terlalu banyak permintaan' }, { status: 429 });
  try {
    const parsed = subscriptionSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError('Alamat email atau topik tidak valid', 400);
    const { email, topic } = parsed.data;

    await prisma.subscription.upsert({
      where: { email_topic: { email, topic } },
      update: {},
      create: {
        email,
        topic,
      },
    });

    return NextResponse.json({ success: true, message: 'Berhasil berlangganan pembaruan!' });
  } catch (err: unknown) {
    return jsonError('Gagal memproses langganan', 500, err);
  }
}
