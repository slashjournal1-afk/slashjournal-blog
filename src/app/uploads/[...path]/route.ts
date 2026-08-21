import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 });
    }

    // Sanitize path segments to prevent directory traversal
    const safeSegments = pathSegments.map((seg) =>
      seg.replace(/\.\./g, '').replace(/[^a-zA-Z0-9_\-.]/g, '')
    );
    const joinedPath = safeSegments.join(path.sep);

    const uploadsBaseDir = path.join(process.cwd(), 'public', 'uploads');
    let targetFilePath = path.join(uploadsBaseDir, joinedPath);

    // 1. Direct path check (e.g. public/uploads/thumbnail/img_xxx.webp)
    if (!fs.existsSync(targetFilePath)) {
      // 2. Fallback check in flat uploads folder (e.g. public/uploads/img_xxx.webp)
      const filenameOnly = safeSegments[safeSegments.length - 1];
      const flatFilePath = path.join(uploadsBaseDir, filenameOnly);
      if (fs.existsSync(flatFilePath)) {
        targetFilePath = flatFilePath;
      } else {
        // 3. Fallback search in all subdirectories of public/uploads
        const candidateFolders = ['thumbnail', 'konten-artikel', 'covers'];
        let foundInSubfolder = false;
        for (const folder of candidateFolders) {
          const subfolderPath = path.join(uploadsBaseDir, folder, filenameOnly);
          if (fs.existsSync(subfolderPath)) {
            targetFilePath = subfolderPath;
            foundInSubfolder = true;
            break;
          }
        }

        if (!foundInSubfolder && !fs.existsSync(targetFilePath)) {
          return NextResponse.json({ error: 'File not found on storage' }, { status: 404 });
        }
      }
    }

    const stat = fs.statSync(targetFilePath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: 'Not a file' }, { status: 400 });
    }

    const ext = path.extname(targetFilePath).toLowerCase();
    const contentType = MIME_MAP[ext] || 'application/octet-stream';
    const fileBuffer = fs.readFileSync(targetFilePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Error serving upload:', error);
    return NextResponse.json({ error: 'Internal server error while fetching file' }, { status: 500 });
  }
}
