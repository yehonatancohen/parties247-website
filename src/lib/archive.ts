import { Party } from '@/data/types';
import { getAllPartiesIncludingPast } from '@/services/api';
import { isBuildPhase } from './buildBudget';

export const ARCHIVE_PAGE_SIZE = 20;

export async function getPastParties(): Promise<Party[]> {
  let parties: Party[];
  try {
    parties = await getAllPartiesIncludingPast();
  } catch (error) {
    // At build time a slow backend must not fail the deploy (see buildBudget.ts):
    // render empty and let ISR fill it in. At runtime, rethrow so ISR keeps
    // serving the last good page instead of caching an empty archive.
    if (isBuildPhase()) return [];
    throw error;
  }
  const now = Date.now();
  return parties
    .filter(p => new Date(p.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // most recent past event first
}

export function paginate<T>(items: T[], page: number, pageSize: number = ARCHIVE_PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
