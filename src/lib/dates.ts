/**
 * Formats a backend date string as an ISO-8601 timestamp with an explicit
 * Asia/Jerusalem UTC offset.
 *
 * The backend serves `date` without any offset (e.g. "2026-09-07T23:00:00.000"),
 * which schema.org consumers read as ambiguous/local. Event `startDate` must
 * carry an offset for Google to render times correctly.
 *
 * Extracted from the copies in `event/[slug]` and `archive/[slug]`; those two
 * still hold their own identical copies and should be migrated onto this one.
 */
export function toIsraelISO(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  // 'sv-SE' locale produces ISO-like "YYYY-MM-DD HH:mm:ss" output
  const localStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
  // Reconstruct a "fake UTC" timestamp from the local parts to compute actual offset
  const [datePart, timePart] = localStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, min, sec] = timePart.split(':').map(Number);
  const localAsUtcMs = Date.UTC(year, month - 1, day, hour, min, sec);
  const offsetMinutes = Math.round((localAsUtcMs - d.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${datePart}T${timePart}${sign}${hh}:${mm}`;
}
