import { addDays, toDateKey } from './date';
import type { CompletionLog, DateKey, Habit, HabitView } from './types';

/** Guard against walking the log forever if it ever contains bad data. */
const MAX_STREAK_LOOKBACK = 3650;

export function countOn(log: CompletionLog, habitId: string, day: DateKey): number {
  return log[habitId]?.[day] ?? 0;
}

/** A day counts as a hit once that day's count reaches the habit's target. */
export function isHit(log: CompletionLog, habit: Habit, day: DateKey): boolean {
  return countOn(log, habit.id, day) >= habit.target;
}

/**
 * Consecutive completed days, counting backwards.
 *
 * The walk starts at today when today is already a hit, and at yesterday when
 * it is not — so a streak *holds* through the day you have yet to do it, and
 * only breaks once a whole day has passed unhit. That also makes untapping
 * today the exact inverse of tapping it.
 */
export function computeStreak(log: CompletionLog, habit: Habit, now: Date): number {
  let cursor = isHit(log, habit, toDateKey(now)) ? now : addDays(now, -1);
  let streak = 0;
  while (streak < MAX_STREAK_LOOKBACK && isHit(log, habit, toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Last seven days including today, oldest first: 1 = hit, 0 = miss. */
export function computeTrail(log: CompletionLog, habit: Habit, now: Date): number[] {
  return Array.from({ length: 7 }, (_, i) =>
    isHit(log, habit, toDateKey(addDays(now, i - 6))) ? 1 : 0,
  );
}

export function toView(log: CompletionLog, habit: Habit, now: Date): HabitView {
  const count = countOn(log, habit.id, toDateKey(now));
  const complete = count >= habit.target;
  return {
    ...habit,
    count,
    streak: computeStreak(log, habit, now),
    trail: computeTrail(log, habit, now),
    complete,
    partial: !complete && count > 0,
  };
}

export function streakLabel(streak: number): string {
  if (streak === 0) return 'new';
  return `${streak} day${streak === 1 ? '' : 's'}`;
}

/** Count habits show today's progress; simple habits show their own note. */
export function metaLabel(habit: HabitView): string {
  return habit.target > 1 ? `${habit.count} of ${habit.target}` : habit.meta;
}
