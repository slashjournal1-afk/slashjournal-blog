import { get } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { jsonError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const segments = (await params).path || [];
    if (!segments.length || segments.some((segment) => segment === '..' || !/^[a-zA-Z0-9_.-]+$/.test(segment))) {
      return NextResponse.json({ error: 'File tidak valid' }, { status: 400 });
    }

    const pathname = segments.join('/');
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await get(pathname, { access: 'private' });
        if (!blob || blob.statusCode !== 200) throw new Error('Blob not found');
        return new Response(blob.stream, {
          headers: {
            'Content-Type': blob.blob.contentType || 'image/webp',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Content-Type-Options': 'nosniff',
          },
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
        console.warn('Blob download failed; using development filesystem:', error);
      }
    }

    if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });

    const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments);
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 404 });
    }

    return new Response(fs.readFileSync(filePath), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('Upload read error:', error);
    return jsonError('Gagal mengambil file', 500, error);
  }
}
