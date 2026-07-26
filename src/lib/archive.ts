import { Party } from '@/data/types';
import { getAllPartiesIncludingPast } from '@/services/api';

export const ARCHIVE_PAGE_SIZE = 20;

export async function getPastParties(): Promise<Party[]> {
  const parties = await getAllPartiesIncludingPast();
  const now = Date.now();
  return parties
    .filter(p => new Date(p.date).getTime() < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // most recent past event first
}

export function paginate<T>(items: T[], page: number, pageSize: number = ARCHIVE_PAGE_SIZE): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
