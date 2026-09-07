/**
 * Formats a backend date string as an ISO-8601 timestamp with an explicit
 * Asia/Jerusalem UTC offset, for schema.org `startDate`.
 *
 * The backend serves `date` as a *naive* local timestamp with no offset
 * (e.g. "2026-09-07T23:00:00.000"), and the wall-clock in that string is
 * already Asia/Jerusalem — "KULAMPO MONDAY - 7.9" really does start 23:00 on
 * Mon 7 Sep. Verified across the whole feed: 119/119 upcoming parties are
 * naive, none carry an offset.
 *
 * The previous implementation round-tripped that string through `new Date()`.
 * A naive date-time is parsed as *server-local*, and the production server runs
 * UTC, so 23:00 was read as 23:00Z and then re-rendered in Jerusalem as
 * 02:00+03:00 **the next day**. With 97 of 119 events starting at or after
 * 22:00, that put the majority of the catalogue on the wrong calendar day in
 * Google's event rich results.
 *
 * So: parse the wall-clock textually and attach the offset that Jerusalem was
 * actually on at that moment — never construct a Date from the naive string.
 * The offset is computed per-event rather than hardcoded to +03:00, because
 * Israel leaves DST on 2026-10-25 and 14 upcoming events fall after it.
 */

const JERUSALEM = 'Asia/Jerusalem';

const jerusalemParts = (instant: Date) => {
  // 'sv-SE' locale produces ISO-like "YYYY-MM-DD HH:mm:ss" output
  const localStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: JERUSALEM,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(instant);
  const [datePart, timePart] = localStr.split(' ');
  return { datePart, timePart };
};

/** Minutes Asia/Jerusalem is ahead of UTC at a given absolute instant. */
const jerusalemOffsetMinutes = (instant: Date): number => {
  const { datePart, timePart } = jerusalemParts(instant);
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, min, sec] = timePart.split(':').map(Number);
  const localAsUtcMs = Date.UTC(year, month - 1, day, hour, min, sec);
  return Math.round((localAsUtcMs - instant.getTime()) / 60000);
};

const formatOffset = (offsetMinutes: number): string => {
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
};

const NAIVE_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/;
const HAS_OFFSET_RE = /(?:Z|[+-]\d{2}:?\d{2})$/;

export function toIsraelISO(dateStr: string): string {
  if (typeof dateStr !== 'string') return dateStr;
  const trimmed = dateStr.trim();

  // Defensive: if a source ever starts sending a real absolute instant (with `Z`
  // or an explicit offset), it must be *converted* into Jerusalem, not relabelled.
  // No party currently arrives this way, but mislabelling one would introduce a
  // 3-hour error in the opposite direction.
  if (HAS_OFFSET_RE.test(trimmed)) {
    const d = new Date(trimmed);
    if (isNaN(d.getTime())) return dateStr;
    const { datePart, timePart } = jerusalemParts(d);
    return `${datePart}T${timePart}${formatOffset(jerusalemOffsetMinutes(d))}`;
  }

  const m = NAIVE_RE.exec(trimmed);
  if (!m) return dateStr;
  const [, year, month, day, hour, minute, second = '00'] = m;

  // Interpret the wall-clock as Jerusalem local. Measure the offset at the
  // instant that wall-clock corresponds to: guess using the naive parts read as
  // UTC, then re-measure at the corrected instant. The second pass only changes
  // the answer within a few hours of a DST transition — which, for events that
  // run 22:00–02:00, is not hypothetical.
  const naiveAsUtcMs = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
  const firstGuess = jerusalemOffsetMinutes(new Date(naiveAsUtcMs));
  const offsetMinutes = jerusalemOffsetMinutes(new Date(naiveAsUtcMs - firstGuess * 60000));

  return `${year}-${month}-${day}T${hour}:${minute}:${second}${formatOffset(offsetMinutes)}`;
}
