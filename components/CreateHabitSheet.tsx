'use client';

import { useEffect, useRef, useState } from 'react';
import type { Draft, Frequency } from '@/lib/types';
import s from './CreateHabitSheet.module.css';

const FREQUENCIES: Frequency[] = ['Daily', 'Weekdays', '3× / week'];
const MIN_TARGET = 1;
const MAX_TARGET = 12;
const SHEET_MS = 320;

const EMPTY_DRAFT: Draft = { name: '', freq: 'Daily', target: 1, reminder: true };

export default function CreateHabitSheet({
  open,
  onClose,
  onCreate,
  initialName
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (draft: Draft) => void;
  initialName?: string
}) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const sheetRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  // Mount on open; stay mounted through the closing animation. The prototype
  // vanishes the sheet instantly — a real one should leave the way it arrived.
  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, SHEET_MS);
    return () => clearTimeout(timer);
  }, [open, mounted]);

  // The draft is discarded on dismissal, as the handoff recommends.
  // if initialName be in deps, changing it might reset what the user is typing
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) setDraft({ ...EMPTY_DRAFT, name: initialName ?? '' });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    // Stop the list behind the scrim from scrolling with the sheet.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      restoreFocusTo.current?.focus();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const nameOk = draft.name.trim().length > 0;
  const patch = (next: Partial<Draft>) => setDraft((current) => ({ ...current, ...next }));

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        className={`${s.scrim} ${closing ? s.scrimClosing : ''}`}
        onClick={onClose}
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-habit-title"
        tabIndex={-1}
        className={`${s.sheet} ${closing ? s.sheetClosing : ''}`}
      >
        <div className={s.grabber} aria-hidden="true" />

        <div className={s.head}>
          <h2 id="new-habit-title" className={s.headTitle}>
            New habit
          </h2>
          <button
            type="button"
            className={`${s.close} tapTarget`}
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (nameOk) onCreate({ ...draft, name: draft.name.trim() });
          }}
        >
          <label className={s.label} htmlFor="habit-name">
            Habit
          </label>
          <input
            id="habit-name"
            className={s.input}
            type="text"
            value={draft.name}
            onChange={(event) => patch({ name: event.target.value })}
            placeholder="Read 20 pages"
            autoComplete="off"
            enterKeyHint="done"
          />

          <div className={`${s.label} ${s.labelRepeat}`} id="repeat-label">
            Repeat
          </div>
          <div className={s.segments} role="group" aria-labelledby="repeat-label">
            {FREQUENCIES.map((freq) => (
              <button
                key={freq}
                type="button"
                className={`${s.segment} ${draft.freq === freq ? s.segmentOn : ''}`}
                aria-pressed={draft.freq === freq}
                onClick={() => patch({ freq })}
              >
                {freq}
              </button>
            ))}
          </div>

          <div className={s.settingRow}>
            <div>
              <div className={s.settingLabel} id="target-label">
                Times per day
              </div>
              <div className={s.settingHint}>For count habits, like glasses of water</div>
            </div>
            <div className={s.stepper}>
              <button
                type="button"
                className={`${s.stepperKey} tapTarget`}
                aria-label="One fewer time per day"
                disabled={draft.target <= MIN_TARGET}
                onClick={() => patch({ target: Math.max(MIN_TARGET, draft.target - 1) })}
              >
                &#8722;
              </button>
              <div className={s.stepperValue} aria-live="polite" aria-labelledby="target-label">
                {draft.target}
              </div>
              <button
                type="button"
                className={`${s.stepperKey} tapTarget`}
                aria-label="One more time per day"
                disabled={draft.target >= MAX_TARGET}
                onClick={() => patch({ target: Math.min(MAX_TARGET, draft.target + 1) })}
              >
                +
              </button>
            </div>
          </div>

          <div className={`${s.settingRow} ${s.settingRowRule}`}>
            <div>
              <div className={s.settingLabel}>Remind me</div>
              <div className={s.settingHint}>
                {draft.reminder ? 'Every day at 8:00 PM' : 'No notification'}
              </div>
            </div>
            {/* TODO(reminders): this only stores the preference. Scheduling needs
                Notification permission + a push subscription; see lib/store.ts. */}
            <button
              type="button"
              role="switch"
              aria-checked={draft.reminder}
              aria-label="Remind me"
              className={`${s.toggle} ${draft.reminder ? s.toggleOn : ''} tapTarget`}
              onClick={() => patch({ reminder: !draft.reminder })}
            >
              <span className={s.knob} />
            </button>
          </div>

          <button type="submit" className={s.submit} disabled={!nameOk}>
            Create habit
          </button>
        </form>
      </div>
    </>
  );
}
