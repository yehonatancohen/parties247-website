export const createCarouselSlug = (value: string) =>
  decodeURIComponent(value)
    .trim()
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

export const findCarouselBySlug = <T extends { title: string }>(
  carousels: T[],
  slug: string | undefined
) => {
  if (!slug) return undefined;

  const normalizedSlug = createCarouselSlug(slug);
  return carousels.find(
    carousel => createCarouselSlug(carousel.title) === normalizedSlug
  );
};

export const findHotNowCarousel = <T extends { title: string }>(
  carousels: T[]
): T | undefined => {
  return carousels.find(c => {
    const slug = createCarouselSlug(c.title).toLowerCase();
    return (
      slug === 'hot-now' ||
      slug === 'חם-עכשיו' ||
      (slug.includes('חם') && slug.includes('עכשיו')) ||
      (slug.includes('hot') && slug.includes('now'))
    );
  });
};