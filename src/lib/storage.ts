import { put, del, list } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Storage service abstraction supporting Vercel Blob (public)
 * and fallback local disk storage for standalone Docker deployments.
 */
export interface UploadResult {
  url: string;
  pathname: string;
  contentType?: string;
  size?: number;
}

export async function uploadFile(
  pathname: string,
  body: Blob | Buffer | string,
  options?: { contentType?: string }
): Promise<UploadResult> {
  const isVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (isVercelBlob) {
    const blob = await put(pathname, body, {
      access: 'public',
      contentType: options?.contentType,
    });

    return {
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType,
    };
  }

  // Local filesystem fallback (Docker / self-hosted)
  const localUploadDir = path.join(process.cwd(), 'public', 'uploads');
  const targetFilePath = path.join(localUploadDir, pathname);
  await fs.mkdir(path.dirname(targetFilePath), { recursive: true });

  const buffer = Buffer.isBuffer(body)
    ? body
    : typeof body === 'string'
      ? Buffer.from(body)
      : Buffer.from(await (body as Blob).arrayBuffer());

  await fs.writeFile(targetFilePath, buffer);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    url: `${appUrl}/uploads/${pathname}`,
    pathname,
    size: buffer.length,
    contentType: options?.contentType,
  };
}

export async function deleteFile(urlOrPath: string): Promise<void> {
  const isVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (isVercelBlob) {
    await del(urlOrPath);
    return;
  }

  try {
    const cleanPath = urlOrPath.replace(/^.*\/uploads\//, '');
    const localFilePath = path.join(process.cwd(), 'public', 'uploads', cleanPath);
    await fs.unlink(localFilePath);
  } catch {
    // Ignore if file doesn't exist locally
  }
}

export async function listStoredFiles(prefix?: string) {
  const isVercelBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  if (isVercelBlob) {
    const result = await list({ prefix });
    return result.blobs.map((b) => ({
      url: b.url,
      pathname: b.pathname,
      size: b.size,
      uploadedAt: b.uploadedAt,
    }));
  }

  return [];
}
