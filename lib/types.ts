/** The three repeat options offered in the create sheet. */
export type Frequency = 'Daily' | 'Weekdays' | '3× / week';

/** A local calendar day, `YYYY-MM-DD`. Always local time, never UTC. */
export type DateKey = string;

/**
 * The stored shape of a habit. Note what is *absent*: `streak`, `count` and
 * `trail` are derived from the completion log on every read (see lib/derive.ts)
 * so they can never drift out of sync with reality.
 */
export type Habit = {
  id: string;
  name: string;
  /** 1 = simple habit, >1 = count habit. */
  target: number;
  freq: Frequency;
  /** Display note under the title ("Evening", "Weekdays", "5 min"). */
  meta: string;
  reminder: boolean;
  createdAt: string;
};

/** `{ [habitId]: { [YYYY-MM-DD]: count } }` — the source of truth. */
export type CompletionLog = Record<string, Record<DateKey, number>>;

export type PersistedState = {
  version: 1;
  habits: Habit[];
  log: CompletionLog;
  /** The day the app last rendered, used to detect a rollover past midnight. */
  lastActiveDate: DateKey;
};

export type Draft = {
  name: string;
  freq: Frequency;
  target: number;
  reminder: boolean;
};

/** A habit plus everything derived from the log for the current day. */
export type HabitView = Habit & {
  count: number;
  streak: number;
  /** Seven days, oldest first, 1 = hit. */
  trail: number[];
  complete: boolean;
  partial: boolean;
};
