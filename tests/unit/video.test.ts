import { describe, it, expect } from 'vitest';
import { getEmbedUrl } from '@/lib/video';

describe('Video Embed URL Parser', () => {
  it('converts standard YouTube watch URLs to privacy-friendly embed URLs', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const embed = getEmbedUrl(url, 'YOUTUBE');
    expect(embed).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('converts short youtu.be URLs to embed URLs', () => {
    const url = 'https://youtu.be/dQw4w9WgXcQ';
    const embed = getEmbedUrl(url, 'YOUTUBE');
    expect(embed).toBe('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  });

  it('converts YouTube Shorts URLs to embed URLs', () => {
    const url = 'https://www.youtube.com/shorts/496ZHYATs1Y';
    const embed = getEmbedUrl(url, 'YOUTUBE');
    expect(embed).toBe('https://www.youtube-nocookie.com/embed/496ZHYATs1Y');
  });

  it('converts Loom share URLs to embed URLs', () => {
    const url = 'https://www.loom.com/share/abc123xyz';
    const embed = getEmbedUrl(url, 'LOOM');
    expect(embed).toBe('https://www.loom.com/embed/abc123xyz');
  });
});

