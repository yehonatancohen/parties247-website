export const createCarouselSlug = (title: string): string => {
  return title
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
};

export const findCarouselBySlug = <T extends { title: string }>(carousels: T[], slug: string | undefined) => {
  if (!slug) return undefined;
  return carousels.find(carousel => createCarouselSlug(carousel.title) === slug);
};
