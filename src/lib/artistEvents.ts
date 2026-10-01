import type { Party } from '@/data/types';

// Verified against the published descriptions: one Hilton closing party,
// promoted through five GoOut listings. Keep all ticket routes available.
const VERIFIED_EVENT_GROUPS = [
  ['1790583291626', '1790583255363', '1790505844161', '1790512458647', '1790777230654'],
];

export function groupArtistEvents(parties: Party[]) {
  const groups = new Map<string, Party[]>();
  for (const party of parties) {
    const eventId = party.originalUrl?.match(/\/event\/([^/?#]+)/)?.[1];
    const verified = VERIFIED_EVENT_GROUPS.find(group => eventId && group.includes(eventId));
    const key = verified ? `goout:${verified[0]}` : `party:${party.id}`;
    const existing = groups.get(key) || [];
    existing.push(party);
    groups.set(key, existing);
  }
  return [...groups.values()].map(variants => ({
    // The owner confirmed the regular Hilton listings have sold out and VIP
    // still has tickets. Point the sole event card at the route that remains buyable.
    party: variants.find(party => /\bVIP\b/i.test(party.name)) || variants[0],
    variants,
  }));
}
