import { expect, it } from 'vitest';
import { groupArtistEvents } from './artistEvents';
import type { Party } from '@/data/types';

it('groups verified promoter copies, preserves VIP routes, and leaves other same-day shows distinct', () => {
  const ids = ['1790583291626', '1790583255363', '1790505844161', '1790512458647', '1790777230654', 'other-show'];
  const parties = ids.map((id, i) => ({ id, name: i === 4 ? 'Rooftop VIP' : 'Omri Smadar', originalUrl: `https://go-out.co/event/${id}?ref=abc` } as Party));
  const groups = groupArtistEvents(parties);
  expect(groups).toHaveLength(2);
  expect(groups[0].variants).toHaveLength(5);
  expect(groups[0].variants.some(p => p.name.includes('VIP'))).toBe(true);
  expect(groups[0].party.name).toContain('VIP');
  expect(groups[1].party.id).toBe('other-show');
});
