# Initialize prompt — paste into Claude Code in VS Code

I'm building a habit-tracking PWA from an HTML design prototype. Read `design_handoff_habit_tracker/README.md` first — it has exact colors, typography, spacing, motion, and behavior. Also open `design_handoff_habit_tracker/Streaks - Habit Tracker.dc.html` in a browser to feel the interactions before writing code.

## What to build
Scope is the **home screen only**: today's habit list with one-tap completion, week strip, per-habit streaks, and a bottom-sheet create-habit form. No auth, no sync, no history view.

## Stack
Vite + React + TypeScript, `vite-plugin-pwa`, local-first persistence. No UI or CSS framework — the design is hand-styled and small. Self-host the Outfit font (weights 300/400) so the app works offline.

## Rules
- The HTML file is a **design reference, not code to copy**. Rebuild it as idiomatic React components; match it pixel-accurately at 402×874 and let it scale.
- Every token in the README is final. Don't substitute colors, invent shadows, or round the spacing.
- Persist a **completion log keyed by local date** (`{habitId, 'YYYY-MM-DD', count}`) as the source of truth. Derive `streak` and today's `count` from it — never store them. Handle day rollover on `visibilitychange`.
- Reminders: build the toggle and store the preference, but stub the scheduling. Leave a clear TODO where the Notifications/Push wiring goes.
- Keep hit targets ≥44px and the name input at ≥16px font size (iOS zoom).
- Respect `env(safe-area-inset-*)` for the top and bottom padding.

## Order of work
1. Scaffold the Vite + React + TS project with the PWA plugin and a valid manifest.
2. Types + persistence layer (`Habit`, completion log, streak/trail derivation, day rollover) with the README's seed habits as dev data.
3. Home screen: header, progress bar, week strip, habit rows, check-button states.
4. Create-habit bottom sheet with the sheet/scrim animations and validation.
5. Verify against the prototype side by side, then tell me what's still undecided.

Ask me before adding anything the README doesn't specify — especially edit/delete, reordering, an empty state, or a history view. Those are deliberately open.
