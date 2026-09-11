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
- [x] 5. Bottom nav: home / add / profile · ~50 min · design
- [ ] 6. Profile screen, holds the theme toggle · ~60 min · design
- [x] 7. Create-habit becomes its own route, with a back button · ~50 min

### Phase 3 — Your own store, written from scratch
- [ ] 8. Step 1: `load()` and `save()` for localStorage — plain functions, no React · ~20 min
- [ ] 9. Step 2: a `useHabits` hook with `useState` that loads on mount and saves on change · ~30 min
- [ ] 10. Step 3: use it on two pages at once and watch the two copies drift apart · ~20 min
- [ ] 11. Step 4: move the state out of React — one shared store, `subscribe`, `useSyncExternalStore` · ~45 min
- [ ] 12. Step 5: delete the old `store.ts` / `useHabits.ts`, bring back day rollover · ~30 min

### Phase 4 — Habit management
- [ ] 13. Make the streak day count obvious on the Today screen · ~40 min · design
- [ ] 14. Habit detail page · ~60 min · design
- [ ] 15. Edit a habit (reuses the create form) · ~50 min
- [ ] 16. Delete a habit + confirm step · ~40 min · design
- [ ] 17. Archive a habit (hide without losing the log) · ~50 min · design
- [ ] 18. EmptyState component: first-run + all-done · ~40 min

### Phase 5 — Data & correctness
- [ ] 19. Test setup + first tests for `lib/` (date, derive, store) · ~60 min
- [ ] 20. Move persistence to IndexedDB · ~60 min
- [ ] 21. Make `freq` real (Weekdays / 3x week) + rest-day empty state · ~60 min
- [ ] 22. Custom end-of-day hour (a day can end at 3 AM, not midnight) · ~60 min · design

### Phase 6 — History & language
- [ ] 23. Tap a day in the week strip to see that day · ~60 min · design
- [ ] 24. Calendar view per habit, on the detail page · ~2 sessions · design
- [ ] 25. Persian / Gregorian calendar switch · ~2 sessions · design
- [ ] 26. Farsi UI language + RTL layout · ~2 sessions · design

### Phase 7 — Habits, reminders & streaks
- [ ] 27. Reminder at a custom hour (replace hardcoded 8:00 PM) · ~50 min · design
- [ ] 28. Real reminder notifications (permission + push + SW handler) · ~2 sessions
- [ ] 29. Surface a broken streak to the user · ~40 min · design
- [ ] 30. Milestones per habit + celebration when one is reached · ~2 sessions · design
- [ ] 31. Streak freeze (skip a day without losing the streak) · ~60 min
- [ ] 32. Habits with steps, e.g. a skincare routine · ~2 sessions · design

### Phase 8 — Focus time
- [ ] 33. Focus time section: a pomodoro timer · ~2 sessions · design
- [ ] 34. Attach a timer to a habit · ~60 min · design
- [ ] 35. Coins earned from focus time, spent on streak freezes · ~2 sessions · design

### Phase 9 — Entry experience & accounts
- [ ] 36. Splash screen with logo animation · ~40 min · design
- [ ] 37. Landing page for first open · ~50 min · design
- [ ] 38. Login form UI · ~60 min · design
- [ ] 39. Login validation + states · ~45 min
- [ ] 40. Real authentication: accounts, sessions, sync · ~3 sessions

### Phase 10 — Platform
- [ ] 41. Move the app into a monorepo · ~60 min
- [ ] 42. Extract the design system into its own package · ~2 sessions
- [ ] 43. Admin panel: users and their data · ~3 sessions · design
- [ ] 44. Android version · ~3 sessions
## Decided against
- **A global app header.** The Today screen's large "Today" title already does a
  header's job, and a fixed bar above it would just cost vertical space. What the
  app actually needs is a *back button on secondary pages*, which each of those
  tasks now carries. Revisit only if the list grows long enough that the title
  scrolls away — then the answer is an iOS-style collapsing title, not a bar.

## Watch out for
- **Tasks 8–12 (your own store).** Replace only `lib/store.ts` and `lib/useHabits.ts`.
  Keep `derive.ts`, `date.ts`, `types.ts` and `seed.ts` — they are pure functions and
  already right. Build the new store next to the old one and swap in step 5, so the
  app keeps working in between. Whatever you write must still: read storage before
  the first write; seed sample data in dev only; store habits + log and nothing else
  (streak, count and trail stay derived); key days as local `YYYY-MM-DD`; render
  nothing until storage is read, so server and client HTML match; and roll the day
  over on `visibilitychange` and at midnight.
- **Task 19 (tests) comes before the refactors on purpose.** IndexedDB (20), the
  day boundary (22) and the design-system extraction (42) all rewrite code that
  currently has nothing checking it. Write the tests against the code as it stands
  today, then refactor underneath them.
- **Task 22 (custom end-of-day hour).** This changes `today()` in lib/date.ts, which
  every streak calculation reads. Days already logged must keep their existing
  `YYYY-MM-DD` key — the new hour applies from the day the setting changes forward,
  it does not retroactively re-bucket old entries.
- **Task 25 (Persian calendar).** The completion log must stay keyed by Gregorian
  `YYYY-MM-DD` — only the *display* converts, never the storage. Also the Persian
  week starts Saturday, but `currentWeek()` in lib/date.ts is hardcoded Sunday-first.
- **Task 26 (Farsi UI) is separate from task 25.** One is the calendar system, the
  other is interface language and text direction; either can ship without the other.
  The cost grows with every screen added, so the longer it waits, the bigger the
  RTL audit gets.
- **Task 31 (streak freeze) ships before coins exist.** Give it a plain free
  allowance to start — say one freeze a month. Task 35 then adds coins as a second
  way to earn them; it should not be the only way.
- **Task 32 (habits with steps).** Changes the `Habit` shape, so it lands best after
  IndexedDB (task 20) rather than before.
- **Task 35 (coins) is not designed yet.** Open questions: what a focus session is
  worth, whether coins buy anything besides freezes, and whether an economy makes
  the app feel like a game in a way that helps or hurts. Decide that before building.
- **Tasks 41–43 are one arc, in order.** Extracting a design system only pays off
  once a second app consumes it, and that second app is the admin panel — which in
  turn needs task 40 (real auth) to have anything to show. Monorepo first so the
  package and the admin app land in their final home rather than being moved twice.

## Not possible as a PWA
- **Home screen widget** — iOS widgets need WidgetKit in a native app; there is no
  web API for one. Android has none either. Would require shipping a real native
  app (or Capacitor shell) alongside this. Task 44 (Android) is the first point at
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
| 2026-09-10 | — | Found `/add` wiping all data (it wrote before the store was read). Added Phase 3: rewrite the store from scratch in five steps, before any task that adds store actions. Everything from 8 on moved up by 5. |
| 2026-09-11 | 5, 7 | Bottom nav + `/add` route done. `/add` is a nav tab, so it needs no back button. Caught on the way: `/add` wrote before the store was read and wiped all data; `useSearchParams` without `Suspense` broke the production build (dev never shows it — run `npm run build` before pushing). |
