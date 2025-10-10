export const segmentsToPath = (segments: string[]): string => `/${segments.join("/")}`;

export const appendPageToSegments = (segments: string[], page: number) => {
  if (page <= 1) {
    return segments;
  }
  return [...segments, "עמוד", page.toString()];
};
