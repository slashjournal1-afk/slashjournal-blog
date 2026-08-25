import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { jsonError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 8000;
const VALID_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']);

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Sesi tidak ditemukan' }, { status: 401 });
    if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
      return NextResponse.json({ error: 'Akses upload ditolak' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) return NextResponse.json({ error: 'Berkas gambar wajib diisi' }, { status: 400 });
    if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: 'Ukuran gambar maksimal 10 MB' }, { status: 413 });
    if (!VALID_MIMES.has(file.type)) return NextResponse.json({ error: 'Format gambar tidak didukung' }, { status: 400 });

    const requestedFolder = String(formData.get('folder') || '');
    if (requestedFolder === 'ads' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses upload iklan ditolak' }, { status: 403 });
    }
    const folder = requestedFolder === 'ads'
      ? 'ads'
      : ['thumbnail', 'cover'].includes(requestedFolder) || ['true', '1'].includes(String(formData.get('isCover')))
      ? 'thumbnail'
      : 'konten-artikel';
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer);
    const metadata = await image.metadata();
    if ((metadata.width || 0) > MAX_IMAGE_DIMENSION || (metadata.height || 0) > MAX_IMAGE_DIMENSION) {
      return NextResponse.json({ error: 'Dimensi gambar terlalu besar' }, { status: 400 });
    }

    const webpBuffer = await image.webp({ quality: 82, effort: 4 }).toBuffer();
    const cleanBaseName = file.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 25);
    const filename = `img_${Date.now()}_${cleanBaseName}_${crypto.randomUUID().slice(0, 8)}.webp`;
    const pathname = `${folder}/${filename}`;
    const altText = String(formData.get('altText') || '').trim();

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(pathname, webpBuffer, {
        access: 'private',
        contentType: 'image/webp',
        addRandomSuffix: false,
      });

      return NextResponse.json({
        success: true,
        url: `/uploads/${blob.pathname}`,
        filename,
        folder,
        storageFilePath: blob.pathname,
        originalName: file.name,
        size: webpBuffer.length,
        width: metadata.width || null,
        height: metadata.height || null,
        format: 'webp',
        sourceType: String(formData.get('sourceType') || 'SELF_SHOT'),
        altText,
        storageProvider: 'vercel-blob',
      });
    }

    if (process.env.NODE_ENV === 'production') {
      return jsonError('Storage gambar belum dikonfigurasi', 503);
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), webpBuffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${folder}/${filename}`,
      filename,
      folder,
      storageFilePath: pathname,
      originalName: file.name,
      size: webpBuffer.length,
      width: metadata.width || null,
      height: metadata.height || null,
      format: 'webp',
      sourceType: String(formData.get('sourceType') || 'SELF_SHOT'),
      altText,
      storageProvider: 'local-development',
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    return jsonError('Gagal memproses unggahan gambar', 500, error);
  }
}
