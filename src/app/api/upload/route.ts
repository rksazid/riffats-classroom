import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { uploadFile } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Basic size limit: 25MB
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds maximum permitted 25MB' },
        { status: 413 }
      );
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_');
    const filename = `${folder}/${Date.now()}-${sanitizedName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadFile(filename, buffer, {
      contentType: file.type || 'application/octet-stream',
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      pathname: result.pathname,
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

