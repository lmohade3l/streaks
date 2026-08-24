import { todayKey } from './date';
import { buildSeedData } from './seed';
import type { CompletionLog, DateKey, Draft, Habit, PersistedState } from './types';

const STORAGE_KEY = 'streaks.v1';

export type Snapshot = {
  /** False until localStorage has been read, so SSR and hydration agree. */
  ready: boolean;
  habits: Habit[];
  log: CompletionLog;
  /** The day the UI is currently rendering; changing it forces a re-derive. */
  day: DateKey;
};

const EMPTY: Snapshot = { ready: false, habits: [], log: {}, day: '1970-01-01' };

let snapshot: Snapshot = EMPTY;
let initialised = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function commit(next: Partial<Snapshot>, persist = true) {
  snapshot = { ...snapshot, ...next };
  if (persist) save();
  emit();
}

function save() {
  if (typeof window === 'undefined') return;
  const state: PersistedState = {
    version: 1,
    habits: snapshot.habits,
    log: snapshot.log,
    lastActiveDate: snapshot.day,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or a full quota: the session still works, it just won't survive a reload.
  }
}

function read(): PersistedState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (parsed?.version !== 1 || !Array.isArray(parsed.habits)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Reads storage once and seeds sample data on a first run in development. */
export function init() {
  if (initialised || typeof window === 'undefined') return;
  initialised = true;

  const stored = read();
  if (stored) {
    commit({ ready: true, habits: stored.habits, log: stored.log, day: todayKey() });
    return;
  }

  const seeded = process.env.NODE_ENV === 'production'
    ? { habits: [], log: {} }
    : buildSeedData();
  commit({ ready: true, ...seeded, day: todayKey() });
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot(): Snapshot {
  return snapshot;
}

export function getServerSnapshot(): Snapshot {
  return EMPTY;
}

/**
 * The single completion gesture. Tapping a finished habit clears the day —
 * that is the undo path, and the derived streak drops by exactly one.
 */
export function tap(habitId: string) {
  const habit = snapshot.habits.find((h) => h.id === habitId);
  if (!habit) return;

  const day = todayKey();
  const current = snapshot.log[habitId]?.[day] ?? 0;
  const next = current >= habit.target ? 0 : current + 1;

  const days = { ...(snapshot.log[habitId] ?? {}) };
  if (next === 0) delete days[day];
  else days[day] = next;

  commit({ log: { ...snapshot.log, [habitId]: days }, day });
}

export function createHabit(draft: Draft): Habit {
  const habit: Habit = {
    id: newId(),
    name: draft.name.trim(),
    target: draft.target,
    freq: draft.freq,
    meta: draft.freq,
    reminder: draft.reminder,
    createdAt: new Date().toISOString(),
  };
  commit({ habits: [...snapshot.habits, habit] });

  // TODO(reminders): schedule the 8:00 PM local notification for this habit.
  // Needs Notification.requestPermission() plus a push subscription posted to
  // /api/reminders (a service-worker `push` handler shows it). On iOS this only
  // works once the PWA is installed to the home screen.
  return habit;
}

/**
 * Day rollover. Counts and streaks are derived from a date-keyed log, so
 * crossing midnight only needs the rendered day to move — nothing to reset.
 */
export function syncDay(): boolean {
  const day = todayKey();
  if (!snapshot.ready || day === snapshot.day) return false;
  commit({ day });
  return true;
}

/** Another tab wrote to storage: adopt its state rather than fight over it. */
export function adoptExternalWrite() {
  if (!initialised) return;
  const stored = read();
  if (!stored) return;
  commit({ habits: stored.habits, log: stored.log, day: todayKey() }, false);
}

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `h-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
