'use client'

import Button from "@/components/ui/Button";
import { Draft, Frequency } from "@/lib/types";
import { useState } from "react";
import s from './Add.module.css'
import { createHabit } from "@/lib/store";

const EMPTY_DRAFT: Draft = { name: '', freq: 'Daily', target: 1, reminder: true };

const FREQUENCIES: Frequency[] = ['Daily', 'Weekdays', '3× / week'];
const MIN_TARGET = 1;
const MAX_TARGET = 12;
const SHEET_MS = 320;

export default function Add() {
    const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

    const nameOk = draft.name.trim().length > 0;
    const patch = (next: Partial<Draft>) => setDraft((current) => ({ ...current, ...next }));

    return (
        <div>
            <div className={s.head}>
                <h2 id="new-habit-title" className={s.headTitle}>
                    New habit
                </h2>
            </div>

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    if (nameOk) createHabit({ ...draft, name: draft.name.trim() });
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

                <Button
                    type="submit"
                    disabled={!nameOk}
                >
                    Create habit
                </Button>
            </form>
        </div>
    )
}