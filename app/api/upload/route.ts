import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// POST /api/upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const type = formData.get('type') as string | null; // 'product' | 'blog' | 'brand'

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    if (!type || !['product', 'blog', 'brand'].includes(type)) {
      return NextResponse.json({ message: 'Invalid or missing upload type' }, { status: 400 });
    }

    // Limit is 2MB
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'File size exceeds the 2MB limit' }, { status: 400 });
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Resolve target path to mojuri-frontend/public/media/<type>
    // process.cwd() is D:\DESKTOP\bai-lam\mijuri-nhi\mojuri-backend
    const frontendPublicPath = path.resolve(process.cwd(), '../mojuri-frontend/public');
    const targetDir = path.join(frontendPublicPath, 'media', type);

    // Ensure the folder exists
    await fs.mkdir(targetDir, { recursive: true });

    // Generate unique name using timestamp
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;
    const filePath = path.join(targetDir, uniqueFilename);

    // Save file on disk
    await fs.writeFile(filePath, buffer);

    // Return the relative URL served by Vite
    const relativeUrl = `media/${type}/${uniqueFilename}`;
    return NextResponse.json({ url: relativeUrl }, { status: 200 });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ message: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
