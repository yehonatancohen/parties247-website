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

export const filterUpcomingParties = <T extends { date: string | number | Date }>(
  parties: T[]
) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return parties.filter((party) => {
    const partyDate = new Date(party.date);
    return !Number.isNaN(partyDate.getTime()) && partyDate >= today;
  });
};