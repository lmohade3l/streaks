import type { DateKey } from './types';

/** Local-time `YYYY-MM-DD`. Deliberately not `toISOString()`, which is UTC. */
export function toDateKey(date: Date): DateKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey(): DateKey {
  return toDateKey(new Date());
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

/** Milliseconds until the next local midnight, +1s of slack. */
export function msUntilMidnight(from: Date = new Date()): number {
  const midnight = new Date(from);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - from.getTime() + 1000;
}

export function formatDateEyebrow(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export type WeekDay = {
  key: DateKey;
  /** Single letter, Sunday-first. */
  label: string;
  date: number;
  isToday: boolean;
  isFuture: boolean;
};

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** The seven days of the current week, Sunday-first. */
export function currentWeek(now: Date = new Date()): WeekDay[] {
  const todayIdx = now.getDay();
  return DAY_LETTERS.map((label, i) => {
    const date = addDays(now, i - todayIdx);
    return {
      key: toDateKey(date),
      label,
      date: date.getDate(),
      isToday: i === todayIdx,
      isFuture: i > todayIdx,
    };
  });
}

/** Parses a `YYYY-MM-DD` key back into a local-midnight Date. */
export function fromDateKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}
