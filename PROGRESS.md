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
- [ ] 4. Button primitive (one component, a few variants) · ~50 min
- [ ] 5. App header · ~40 min · design
- [ ] 6. Theme toggle, lives in the header · ~45 min
- [ ] 7. Bottom nav: home / add / profile · ~50 min · design
- [ ] 8. Create-habit becomes its own route · ~50 min
- [ ] 9. Habit detail page + delete a habit · ~60 min · design
- [ ] 10. EmptyState component: first-run + all-done · ~40 min

### Phase 3 — Data
- [ ] 11. Move persistence to IndexedDB · ~60 min
- [ ] 12. Make `freq` real (Weekdays / 3x week) + rest-day empty state · ~60 min

### Phase 4 — Habits & reminders
- [ ] 13. Reminder at a custom hour (replace hardcoded 8:00 PM) · ~50 min · design
- [ ] 14. Real reminder notifications (permission + push + SW handler) · ~2 sessions
- [ ] 15. Surface a broken streak to the user · ~40 min · design
- [ ] 16. Streak freeze (skip a day without losing the streak) · ~60 min
- [ ] 17. Multi-section habits · ~60 min · design · scope unclear, decide first

### Phase 5 — Entry experience
- [ ] 18. Splash screen with logo animation · ~40 min · design
- [ ] 19. Landing page for first open · ~50 min · design
- [ ] 20. Login form UI · ~60 min · design
- [ ] 21. Login validation + states · ~45 min

## Not possible as a PWA
- **Home screen widget** — iOS widgets need WidgetKit in a native app; there is no
  web API for one. Android has none either. Would require shipping a real native
  app (or Capacitor shell) alongside this. Parked, not scheduled.

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
