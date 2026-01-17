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
