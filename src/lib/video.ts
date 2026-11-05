export function getEmbedUrl(url: string, provider: string): string {
  if (!url) return '';

  if (provider === 'YOUTUBE') {
    // Handle youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
    }

    // Handle youtube.com/watch?v=ID
    const standardMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (standardMatch && standardMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${standardMatch[1]}`;
    }

    // Handle youtube.com/embed/ID
    const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (embedMatch && embedMatch[1]) {
      return `https://www.youtube-nocookie.com/embed/${embedMatch[1]}`;
    }

    return url;
  }

  if (provider === 'LOOM') {
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch && loomMatch[1]) {
      return `https://www.loom.com/embed/${loomMatch[1]}`;
    }
    return url;
  }

  return url;
}

