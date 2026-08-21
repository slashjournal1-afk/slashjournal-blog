import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createAdminClient } from '@/lib/supabase/admin';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Sesi Anda tidak ditemukan atau telah kedaluwarsa. Silakan masuk (login) kembali.' },
        { status: 401 }
      );
    }

    if (!['ADMIN', 'EDITOR', 'AUTHOR'].includes(user.role)) {
      return NextResponse.json(
        { error: `Akses ditolak: Akun Anda memiliki role (${user.role}). Hanya role ADMIN, EDITOR, atau AUTHOR yang berhak mengunggah gambar.` },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const sourceType = (formData.get('sourceType') as string) || 'SELF_SHOT'; // C4 & CM7 compliance
    const altText = (formData.get('altText') as string) || '';

    // Folder routing: 'thumbnail' (cover image) vs 'konten-artikel' (in-content images)
    const folderParam = (formData.get('folder') as string) || '';
    const typeParam = (formData.get('type') as string) || '';
    const isCoverParam = (formData.get('isCover') as string) || '';

    let targetFolder = 'konten-artikel';
    if (
      folderParam === 'thumbnail' ||
      folderParam === 'cover' ||
      typeParam === 'thumbnail' ||
      typeParam === 'cover' ||
      isCoverParam === 'true' ||
      isCoverParam === '1'
    ) {
      targetFolder = 'thumbnail';
    } else {
      targetFolder = 'konten-artikel';
    }

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada berkas gambar yang diunggah' }, { status: 400 });
    }

    // Validate mime types
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format berkas tidak didukung. Unggah gambar JPG, PNG, WEBP, atau GIF.' },
        { status: 400 }
      );
    }

    // Convert File to ArrayBuffer and Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique clean webp filename
    const timestamp = Date.now();
    const randomHash = Math.random().toString(36).substring(2, 8);
    const cleanBaseName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 25);
    const filename = `img_${timestamp}_${cleanBaseName}_${randomHash}.webp`;
    const storageFilePath = `${targetFolder}/${filename}`;

    // Process & Convert to WebP using Sharp
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const webpBuffer = await image
      .webp({
        quality: 82,
        effort: 4,
      })
      .toBuffer();

    let publicUrl = '';
    let storageProvider = 'local';

    // 1. Try uploading to Supabase Storage Bucket in subfolder (thumbnail/ or konten-artikel/)
    try {
      const supabase = createAdminClient();
      const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'slashjournal';

      // Ensure bucket exists and is public
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        if (buckets && !buckets.some((b) => b.name === bucketName)) {
          await supabase.storage.createBucket(bucketName, { public: true });
        }
      } catch (bucketCheckErr) {
        // Continue if bucket listing is restricted or already exists
      }

      // Upload to bucket under target folder
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storageFilePath, webpBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
      } else if (uploadData) {
        const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storageFilePath);
        if (publicUrlData?.publicUrl) {
          publicUrl = publicUrlData.publicUrl;
          storageProvider = 'supabase';
        }
      }
    } catch (supabaseErr: any) {
      console.warn('Supabase upload exception (falling back to local):', supabaseErr?.message || supabaseErr);
    }

    // 2. Fallback to local storage in public/uploads/${targetFolder} if Supabase upload was not successful
    if (!publicUrl) {
      const uploadsBaseDir = path.join(process.cwd(), 'public', 'uploads');
      const uploadDir = path.join(uploadsBaseDir, targetFolder);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, webpBuffer);
      
      // Also copy to flat uploads directory for maximum backward compatibility
      try {
        const flatFilePath = path.join(uploadsBaseDir, filename);
        if (!fs.existsSync(flatFilePath)) {
          fs.writeFileSync(flatFilePath, webpBuffer);
        }
      } catch {}

      publicUrl = `/uploads/${targetFolder}/${filename}`;
      storageProvider = 'local';
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      folder: targetFolder,
      storageFilePath,
      originalName: file.name,
      size: webpBuffer.length,
      width: metadata.width || null,
      height: metadata.height || null,
      format: 'webp',
      sourceType,
      altText,
      storageProvider,
      message: `Gambar berhasil dikonversi ke WebP dan disimpan di folder '${targetFolder}' (${storageProvider === 'supabase' ? 'Supabase Storage' : 'Local Storage'}).`,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memproses unggahan gambar' }, { status: 500 });
  }
}
