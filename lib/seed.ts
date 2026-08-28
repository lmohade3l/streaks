import { addDays, toDateKey } from './date';
import type { CompletionLog, Habit } from './types';

type Seed = {
  habit: Omit<Habit, 'createdAt'>;
  /** Target streak to synthesise backwards from today. */
  streak: number;
  /** Today's count, so the list opens with a mix of states. */
  today: number;
};

/**
 * The README's sample habits. Because streaks are derived, the log is
 * synthesised backwards from today to *produce* each streak — the dot trails
 * therefore follow from the log rather than being hand-authored like the
 * prototype's, and will differ slightly from the static mock.
 */
const SEEDS: Seed[] = [
  { habit: { id: 'seed-read', name: 'Read 20 pages', target: 1, freq: 'Daily', meta: 'Evening', reminder: true }, streak: 12, today: 1 },
  { habit: { id: 'seed-run', name: 'Morning run', target: 1, freq: 'Daily', meta: 'Daily', reminder: true }, streak: 4, today: 0 },
  { habit: { id: 'seed-water', name: 'Water', target: 6, freq: 'Daily', meta: 'Daily', reminder: false }, streak: 23, today: 2 },
  { habit: { id: 'seed-duolingo', name: 'Duolingo', target: 1, freq: 'Daily', meta: '5 min', reminder: true }, streak: 61, today: 1 },
  { habit: { id: 'seed-sugar', name: 'No sugar', target: 1, freq: 'Weekdays', meta: 'Weekdays', reminder: false }, streak: 2, today: 0 },
];

export function buildSeedData(now: Date = new Date()): { habits: Habit[]; log: CompletionLog } {
  const habits: Habit[] = [];
  const log: CompletionLog = {};

  for (const { habit, streak, today } of SEEDS) {
    const doneToday = today >= habit.target;
    const days: Record<string, number> = {};

    // A completed today anchors the streak at day 0; otherwise it ends yesterday.
    const firstOffset = doneToday ? 0 : -1;
    for (let i = 0; i < streak; i += 1) {
      days[toDateKey(addDays(now, firstOffset - i))] = habit.target;
    }
    if (!doneToday && today > 0) {
      days[toDateKey(now)] = today;
    }

    habits.push({ ...habit, createdAt: addDays(now, -(streak + 1)).toISOString() });
    log[habit.id] = days;
  }

  return { habits, log };
}
