export type PossibleTitle = string | { he?: string } | null | undefined;

const normalizeSlugValue = (value?: string): string => {
  if (!value || typeof value !== 'string') return '';

  return decodeURIComponent(value)
    .toLowerCase()
    .trim()
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const extractSlugFromUrl = (url?: string): string => {
  if (!url || typeof url !== 'string') return '';

  try {
    const match = url.match(/\/event\/([^/?#]+)/);
    if (match && match[1]) {
      return normalizeSlugValue(match[1]);
    }
  } catch (e) {
    console.error('Could not parse URL to derive slug:', url);
  }

  return '';
};

export const derivePartySlug = (params: {
  slug?: string;
  title?: PossibleTitle;
  name?: string;
  goOutUrl?: string;
  originalUrl?: string;
}): string => {
  const providedSlug = normalizeSlugValue(params.slug);
  const urlSlug = extractSlugFromUrl(params.goOutUrl || params.originalUrl);

  const titleValue =
    typeof params.title === 'object' && params.title !== null
      ? params.title.he
      : params.title;
  const nameForSlug = titleValue || params.name || '';
  const titleSlug = normalizeSlugValue(nameForSlug);

  const isNumericSlug = (value: string) => /^[0-9-]+$/.test(value);

  if (providedSlug && !isNumericSlug(providedSlug)) {
    return providedSlug;
  }

  if (titleSlug && (providedSlug || urlSlug)) {
    const suffix = providedSlug || urlSlug;
    return `${titleSlug}${suffix ? `-${suffix}` : ''}`;
  }

  if (titleSlug) return titleSlug;
  if (urlSlug) return urlSlug;
  return providedSlug || '';
};

export { normalizeSlugValue as createPartySlug };
