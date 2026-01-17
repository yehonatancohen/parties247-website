const getWeekCacheKey = (date: Date = new Date()): string => {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNumber = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNumber);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${utcDate.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const isActivePartyDate = (partyDate?: string): boolean => {
  if (!partyDate) return true;
  const eventDate = new Date(partyDate);
  if (Number.isNaN(eventDate.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return eventDate >= today;
};

const goOutCoverCache = new Map<string, Promise<string | null>>();

const normalizeGoOutImageUrl = (imagePath: string): string => {
  const normalizedPath = imagePath.replace('_whatsappImage.jpg', '_coverImage.jpg');
  if (normalizedPath.startsWith('http')) {
    return normalizedPath;
  }
  const cleanedPath = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  return `https://d15q6k8l9pfut7.cloudfront.net/${cleanedPath}`;
};

export const fetchGoOutCoverImage = async (eventUrl: string): Promise<string | null> => {
  if (!eventUrl || !eventUrl.includes('go-out.co')) return null;

  const cacheKey = `${eventUrl}|${getWeekCacheKey()}`;
  const cached = goOutCoverCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const fetchPromise = (async () => {
    try {
      const response = await fetch(eventUrl, {
        next: { revalidate: 60 * 60 * 24 * 7 },
      });
      if (!response.ok) return null;
      const htmlText = await response.text();
      if (!htmlText) return null;

      const nextDataMatch = htmlText.match(/<script[^>]*id=\"__NEXT_DATA__\"[^>]*>(.*?)<\\/script>/s);
      if (nextDataMatch?.[1]) {
        const jsonData = JSON.parse(nextDataMatch[1]);
        const eventData = jsonData?.props?.pageProps?.event;
        const imagePath = eventData?.CoverImage?.Url || eventData?.WhatsappImage?.Url || '';
        if (imagePath) {
          return normalizeGoOutImageUrl(imagePath);
        }
      }

      const ogImageMatch = htmlText.match(/<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"'][^>]*>/i);
      if (ogImageMatch?.[1]) {
        return normalizeGoOutImageUrl(ogImageMatch[1]);
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch go-out cover image:', error);
      return null;
    }
  })();

  goOutCoverCache.set(cacheKey, fetchPromise);
  return fetchPromise;
};

export const getWeeklyCoverImageUrl = (imageUrl: string, partyDate?: string): string => {
  if (!imageUrl) return imageUrl;
  if (!isActivePartyDate(partyDate)) return imageUrl;

  const cacheKey = getWeekCacheKey();

  try {
    const url = new URL(imageUrl);
    url.searchParams.set('v', cacheKey);
    return url.toString();
  } catch (error) {
    const [path, query = ''] = imageUrl.split('?');
    const params = new URLSearchParams(query);
    params.set('v', cacheKey);
    return `${path}?${params.toString()}`;
  }
};
