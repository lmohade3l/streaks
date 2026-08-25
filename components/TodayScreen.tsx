'use client';

import { useState } from 'react';
import CreateHabitSheet from './CreateHabitSheet';
import HabitRow from './HabitRow';
import WeekStrip from './WeekStrip';
import s from './TodayScreen.module.css';
import { useHabits } from '@/lib/useHabits';

export default function TodayScreen() {
  const { ready, habits, done, total, progressPct, allDone, dateLabel, week, tap, createHabit } =
    useHabits();
  const [sheetOpen, setSheetOpen] = useState(false);

  // Until storage has been read there is no honest list to draw, and the date
  // would differ between server and client. Hold the painted background.
  if (!ready) return <main className={s.screen} aria-busy="true" />;

  return (
    <main className={s.screen}>
      <div className={s.scroll}>
        <header className={s.header}>
          <div>
            <div className={s.eyebrow}>{dateLabel}</div>
            <h1 className={s.title}>Today</h1>
          </div>
          <div className={s.counterWrap}>
            <div className={s.counter}>
              {done}
              <span className={s.counterTotal}>/{total}</span>
            </div>
            <div className={s.counterLabel}>done</div>
          </div>
        </header>

        <div
          className={s.track}
          role="progressbar"
          aria-label="Habits completed today"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
        >
          <div className={s.fill} style={{ width: `${progressPct}%` }} />
        </div>

        <WeekStrip week={week} />

        {habits?.length === 0 && (
          <div>
            <div></div>
            <p className={s.emptyStateTitle}>Start with one.</p>
            <div>
              <p className={s.emptyStateSubtitle}>One habit you'd keep on a bad day. You can always add more once it sticks.</p>
            </div>
            <div>
              <p className={s.emptyStateOptionsTitle}>Common starts</p>
            </div>
            <div className={s?.emptyStateOptionsContainer}>
              {
                ['Read 20 pages' , 'Walk 30 min' , 'Water · 6 glasses' , 'Stretch' , 'No phone in bed']?.map(h => (
                  <button onClick={() => setSheetOpen(true)} className={s.emptyStateOptionButton}>{h}</button>
                ))
              }
            </div>
          </div>
        )}

        <ul className={s.list}>
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} onTap={tap} />
          ))}
        </ul>

        {allDone && <p className={s.allDone}>Everything&rsquo;s done. See you tomorrow.</p>}
      </div>

      <div className={s.footer}>
        <button type="button" className={s.cta} onClick={() => setSheetOpen(true)}>
          <span className={s.ctaPlus} aria-hidden="true">
            +
          </span>
          New habit
        </button>
      </div>

      <CreateHabitSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onCreate={(draft) => {
          createHabit(draft);
          setSheetOpen(false);
        }}
      />
    </main>
  );
}
