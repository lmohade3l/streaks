# Streaks — Build Log

One task per day. Ask Claude for "the next task" and it hands over exactly one,
with a UI prompt attached when the task needs design.

**Rule:** never look further down this list than the task you are on.

## Checklist

### Phase 1 — Foundation
- [x] 1. Empty state for the habit list · ~40 min · design
- [ ] 2. Token cleanup + fixes from task 1 review · ~40 min
- [ ] 3. Dark palette, follows system setting · ~45 min
- [ ] 4. Theme toggle + remember the choice · ~40 min

### Phase 2 — Shared pieces
- [ ] 5. Button primitive (one component, a few variants) · ~50 min
- [ ] 6. EmptyState component: first-run + all-done · ~40 min

### Phase 3 — Navigation shell
- [ ] 7. App header · ~40 min · design
- [ ] 8. Bottom nav: home / add / profile · ~50 min · design
- [ ] 9. Create-habit becomes its own route · ~50 min
- [ ] 10. Habit detail page + delete a habit · ~60 min · design

### Phase 4 — Data & logic
- [ ] 11. Move persistence to IndexedDB · ~60 min
- [ ] 12. Make `freq` real (Weekdays / 3× week) + rest-day empty state · ~60 min

### Phase 5 — Entry experience
- [ ] 13. Splash screen with logo animation · ~40 min · design
- [ ] 14. Landing page for first open · ~50 min · design
- [ ] 15. Login form UI · ~60 min · design
- [ ] 16. Login validation + states · ~45 min

## Log

| Date | Task | Notes |
|------|------|-------|
| 2026-08-25 | — | Checklist created. |
| 2026-08-25 | 1 | Empty state shipped. Good copy, good "common starts" idea. Review: seeds left commented out, colors hardcoded instead of tokens, missing `key`, chips don't prefill the name. Folded into task 2. |
| 2026-08-25 | — | Added tasks 5, 6, 10, 12. Reordered: token cleanup now precedes dark mode. |
