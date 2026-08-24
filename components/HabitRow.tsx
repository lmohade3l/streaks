import { metaLabel, streakLabel } from '@/lib/derive';
import type { HabitView } from '@/lib/types';
import s from './HabitRow.module.css';

const HOT_STREAK = 20;

export default function HabitRow({
  habit,
  onTap,
}: {
  habit: HabitView;
  onTap: (id: string) => void;
}) {
  const hot = habit.streak >= HOT_STREAK;
  const isCount = habit.target > 1;

  return (
    <li className={`${s.row} ${habit.complete ? s.rowComplete : ''}`}>
      <div className={s.body}>
        <div className={`${s.name} ${habit.complete ? s.nameComplete : ''}`}>{habit.name}</div>
        <div className={s.meta}>
          <div className={s.trail} aria-hidden="true">
            {habit.trail.map((hit, i) => (
              <div
                key={i}
                className={`${s.dot} ${hit ? (hot ? s.dotHitHot : s.dotHit) : ''}`}
              />
            ))}
          </div>
          <div className={`${s.streak} ${hot ? s.streakHot : ''}`}>{streakLabel(habit.streak)}</div>
          <div className={s.divider} aria-hidden="true" />
          <div className={s.note}>{metaLabel(habit)}</div>
        </div>
      </div>

      <button
        type="button"
        className={`${s.check} ${
          habit.complete ? s.checkComplete : habit.partial ? s.checkPartial : ''
        }`}
        aria-label={label(habit)}
        aria-pressed={isCount ? undefined : habit.complete}
        onClick={() => onTap(habit.id)}
      >
        <span aria-hidden="true">
          {habit.complete ? '✓' : isCount ? `${habit.count}/${habit.target}` : ''}
        </span>
      </button>
    </li>
  );
}

function label(habit: HabitView): string {
  if (habit.complete) return `${habit.name}, done. Tap to undo.`;
  if (habit.target > 1) return `${habit.name}, ${habit.count} of ${habit.target}. Add one.`;
  return `Complete ${habit.name}`;
}
