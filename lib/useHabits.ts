'use client';

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { currentWeek, formatDateEyebrow, fromDateKey, msUntilMidnight } from './date';
import { toView } from './derive';
import * as store from './store';
import type { Draft } from './types';

export function useHabits() {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);

  useEffect(() => {
    store.init();
  }, []);

  // Day rollover: the app is long-lived on a phone, so the visible day can go
  // stale while it sits backgrounded.
  useEffect(() => {
    const check = () => {
      if (document.visibilityState === 'visible') store.syncDay();
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === 'streaks.v1') store.adoptExternalWrite();
    };

    document.addEventListener('visibilitychange', check);
    window.addEventListener('focus', check);
    window.addEventListener('storage', onStorage);
    return () => {
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('focus', check);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // ...and while it stays open across midnight.
  useEffect(() => {
    if (!snapshot.ready) return;
    const timer = setTimeout(() => store.syncDay(), msUntilMidnight());
    return () => clearTimeout(timer);
  }, [snapshot.ready, snapshot.day]);

  // Everything below is derived from the log — nothing here is ever stored.
  const now = useMemo(() => fromDateKey(snapshot.day), [snapshot.day]);

  const habits = useMemo(
    () => snapshot.habits.map((habit) => toView(snapshot.log, habit, now)),
    [snapshot.habits, snapshot.log, now],
  );

  const done = habits.filter((h) => h.complete).length;
  const total = habits.length;

  return {
    ready: snapshot.ready,
    habits,
    done,
    total,
    progressPct: total ? Math.round((done / total) * 100) : 0,
    allDone: total > 0 && done === total,
    dateLabel: formatDateEyebrow(now),
    week: useMemo(() => currentWeek(now), [now]),
    tap: useCallback((id: string) => store.tap(id), []),
    createHabit: useCallback((draft: Draft) => store.createHabit(draft), []),
  };
}
