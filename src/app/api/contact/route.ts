import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jsonError } from '@/lib/api-errors';
import { contactSchema } from '@/lib/validation';
import { rateLimit, requestKey } from '@/lib/rate-limit';

export async function POST(req: Request) {
  if (!rateLimit(requestKey(req, 'contact'), 5, 3600_000)) {
    return NextResponse.json({ error: 'Terlalu banyak pesan. Coba lagi dalam satu jam.' }, { status: 429 });
  }
  try {
    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Pesan kontak tidak valid', 400);
    const { name, email, subject, message } = parsed.data;

    const saved = await prisma.contactMessage.create({
      data: { name, email, subject, message },
      select: { id: true, createdAt: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Pesan diterima dan tercatat. Kami meninjau setiap pesan pada hari kerja.',
      id: saved.id,
    });
  } catch (err: unknown) {
    return jsonError('Gagal mengirim pesan', 500, err);
  }
}
