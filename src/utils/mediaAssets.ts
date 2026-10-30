function stripQueryString(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/\?.*$/, '')
    .replace(/&.*$/, '');
}

export function resolvePublicAssetUrl(value?: string | null): string {
  if (!value) return '';

  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const decoded = decodeURIComponent(trimmed).replace(/&amp;/gi, '&');
  const nextImageMatch = decoded.match(/\/_next\/image\?url=(.+?)(?:&|$)/i);
  const candidate = nextImageMatch ? nextImageMatch[1] : decoded;
  const normalized = stripQueryString(decodeURIComponent(candidate)).replace(/^https?:\/\/[^/]+/i, '');

  if (normalized.startsWith('/images/')) {
    return normalized;
  }

  if (normalized.startsWith('/media/')) {
    const fileName = normalized.split('/').pop();
    return fileName ? `/images/${fileName}` : '/brand/logo.png';
  }

  if (normalized.startsWith('/')) {
    return normalized;
  }

  const fileName = normalized.split('/').pop();
  return fileName ? `/images/${fileName}` : '/brand/logo.png';
}

export function sanitizeGeneratedHtml(html?: string): string {
  if (!html) return '';

  return html.replace(/\/_next\/image\?url=([^"'\s]+)/gi, (_match, encodedValue) => {
    const cleaned = stripQueryString(decodeURIComponent(encodedValue).replace(/&amp;/gi, '&'));
    const resolved = resolvePublicAssetUrl(cleaned);
    return resolved || `/_next/image?url=${encodedValue}`;
  });
}
