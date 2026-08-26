import type { WeekDay } from '@/lib/date';
import s from './WeekStrip.module.css';

export default function WeekStrip({ week, className = '' }: { week: WeekDay[], className?: string }) {
  return (
    <div className={`${s.strip} ${className}`}>
      {week.map((day) => (
        <div key={day.key} className={s.day}>
          <div className={`${s.letter} ${day.isToday ? s.letterToday : ''}`} aria-hidden="true">
            {day.label}
          </div>
          <div
            className={`${s.cell} ${day.isToday ? s.today : day.isFuture ? s.future : s.past}`}
            aria-current={day.isToday ? 'date' : undefined}
          >
            {day.date}
          </div>
        </div>
      ))}
    </div>
  );
}
