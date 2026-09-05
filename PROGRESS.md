# Streaks — Build Log

One task per day. Ask Claude for "the next task" and it hands over exactly one,
with a UI prompt attached when the task needs design.

**Rule:** never look further down this list than the task you are on.

## Checklist

### Phase 1 — Foundation
- [x] 1. Empty state for the habit list · ~40 min · design
- [x] 2. Token cleanup + fixes from task 1 review · ~40 min
- [x] 3. Dark palette, follows system setting · ~45 min

### Phase 2 — Shell
- [x] 4. Button primitive (one component, a few variants) · ~50 min
- [ ] 5. Bottom nav: home / add / profile · ~50 min · design
- [ ] 6. Profile screen, holds the theme toggle · ~60 min · design
- [ ] 7. Create-habit becomes its own route, with a back button · ~50 min
- [ ] 8. Make the streak day count obvious on the Today screen · ~40 min · design
- [ ] 9. Habit detail page · ~60 min · design
- [ ] 10. Edit a habit (reuses the create form) · ~50 min
- [ ] 11. Delete a habit + confirm step · ~40 min · design
- [ ] 12. Archive a habit (hide without losing the log) · ~50 min · design
- [ ] 13. EmptyState component: first-run + all-done · ~40 min

### Phase 3 — Data & correctness
- [ ] 14. Test setup + first tests for `lib/` (date, derive, store) · ~60 min
- [ ] 15. Move persistence to IndexedDB · ~60 min
- [ ] 16. Make `freq` real (Weekdays / 3x week) + rest-day empty state · ~60 min
- [ ] 17. Custom end-of-day hour (a day can end at 3 AM, not midnight) · ~60 min · design

### Phase 4 — History & language
- [ ] 18. Tap a day in the week strip to see that day · ~60 min · design
- [ ] 19. Calendar view per habit, on the detail page · ~2 sessions · design
- [ ] 20. Persian / Gregorian calendar switch · ~2 sessions · design
- [ ] 21. Farsi UI language + RTL layout · ~2 sessions · design

### Phase 5 — Habits, reminders & streaks
- [ ] 22. Reminder at a custom hour (replace hardcoded 8:00 PM) · ~50 min · design
- [ ] 23. Real reminder notifications (permission + push + SW handler) · ~2 sessions
- [ ] 24. Surface a broken streak to the user · ~40 min · design
- [ ] 25. Milestones per habit + celebration when one is reached · ~2 sessions · design
- [ ] 26. Streak freeze (skip a day without losing the streak) · ~60 min
- [ ] 27. Habits with steps, e.g. a skincare routine · ~2 sessions · design

### Phase 6 — Focus time
- [ ] 28. Focus time section: a pomodoro timer · ~2 sessions · design
- [ ] 29. Attach a timer to a habit · ~60 min · design
- [ ] 30. Coins earned from focus time, spent on streak freezes · ~2 sessions · design

### Phase 7 — Entry experience & accounts
- [ ] 31. Splash screen with logo animation · ~40 min · design
- [ ] 32. Landing page for first open · ~50 min · design
- [ ] 33. Login form UI · ~60 min · design
- [ ] 34. Login validation + states · ~45 min
- [ ] 35. Real authentication: accounts, sessions, sync · ~3 sessions

### Phase 8 — Platform
- [ ] 36. Move the app into a monorepo · ~60 min
- [ ] 37. Extract the design system into its own package · ~2 sessions
- [ ] 38. Admin panel: users and their data · ~3 sessions · design
- [ ] 39. Android version · ~3 sessions

## Decided against
- **A global app header.** The Today screen's large "Today" title already does a
  header's job, and a fixed bar above it would just cost vertical space. What the
  app actually needs is a *back button on secondary pages*, which each of those
  tasks now carries. Revisit only if the list grows long enough that the title
  scrolls away — then the answer is an iOS-style collapsing title, not a bar.

## Watch out for
- **Task 14 (tests) comes before the refactors on purpose.** IndexedDB (15), the
  day boundary (17) and the design-system extraction (37) all rewrite code that
  currently has nothing checking it. Write the tests against the code as it stands
  today, then refactor underneath them.
- **Task 17 (custom end-of-day hour).** This changes `today()` in lib/date.ts, which
  every streak calculation reads. Days already logged must keep their existing
  `YYYY-MM-DD` key — the new hour applies from the day the setting changes forward,
  it does not retroactively re-bucket old entries.
- **Task 20 (Persian calendar).** The completion log must stay keyed by Gregorian
  `YYYY-MM-DD` — only the *display* converts, never the storage. Also the Persian
  week starts Saturday, but `currentWeek()` in lib/date.ts is hardcoded Sunday-first.
- **Task 21 (Farsi UI) is separate from task 20.** One is the calendar system, the
  other is interface language and text direction; either can ship without the other.
  The cost grows with every screen added, so the longer it waits, the bigger the
  RTL audit gets.
- **Task 26 (streak freeze) ships before coins exist.** Give it a plain free
  allowance to start — say one freeze a month. Task 30 then adds coins as a second
  way to earn them; it should not be the only way.
- **Task 27 (habits with steps).** Changes the `Habit` shape, so it lands best after
  IndexedDB (task 15) rather than before.
- **Task 30 (coins) is not designed yet.** Open questions: what a focus session is
  worth, whether coins buy anything besides freezes, and whether an economy makes
  the app feel like a game in a way that helps or hurts. Decide that before building.
- **Tasks 36–38 are one arc, in order.** Extracting a design system only pays off
  once a second app consumes it, and that second app is the admin panel — which in
  turn needs task 35 (real auth) to have anything to show. Monorepo first so the
  package and the admin app land in their final home rather than being moved twice.

## Not possible as a PWA
- **Home screen widget** — iOS widgets need WidgetKit in a native app; there is no
  web API for one. Android has none either. Would require shipping a real native
  app (or Capacitor shell) alongside this. Task 39 (Android) is the first point at
  which a widget becomes possible, and only on that platform.

## Log

| Date | Task | Notes |
|------|------|-------|
| 2026-08-25 | — | Checklist created. |
| 2026-08-25 | 1 | Empty state shipped. Good copy, good "common starts" idea. Review: seeds left commented out, colors hardcoded instead of tokens, missing `key`, chips don't prefill the name. Folded into task 2. |
| 2026-08-25 | — | Added tasks 5, 6, 10, 12. Reordered: token cleanup now precedes dark mode. |
| 2026-08-27 | 2 | Done. Lesson: the `font` shorthand needs both size and family or the whole declaration is dropped — use longhand so the family is inherited. |
| 2026-08-27 | — | Added reminders/streak/sections tasks (13-17). Widget parked: not possible from a PWA. |
| 2026-08-27 | 3 | Dark palette done, all tokens flip correctly. Seeds are commented out again in lib/seed.ts. |
| 2026-08-27 | — | Reordered: theme toggle now follows the header, since the button needs somewhere to live. |
| 2026-08-30 | — | Added edit / delete-confirm / archive / past-days / calendar view / Persian calendar. Renumbered; 27 tasks total. |
| 2026-08-30 | — | Commit email was the work address, so GitHub attributed nothing. Rewrote all 16 commits to the noreply address and force-pushed. |
| 2026-08-30 | — | Dropped the app-header task; theme toggle moves to the profile screen. 26 tasks now. |
| 2026-08-30 | 4 | Button primitive done: primary / outlined / icon. tapTarget now lives inside the component. Noted: disabled primary reads too light in dark mode. |
| 2026-09-05 | — | Added 12 tasks: milestones, clearer streak numbers, focus time + habit timers + coins, tests, design system, auth, admin panel, Android, Farsi UI, monorepo, custom end-of-day hour. Renumbered 1–39; the old list skipped 13. Two priority changes: tests moved up to 14 (ahead of every refactor that needs them), and the clearer streak number moved up to 8 (small, and the detail page should reuse whatever treatment it settles on). |
