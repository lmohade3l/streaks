# Handoff: Streaks — Habit Tracker PWA (Home + Create Habit)

## Overview
A minimal, offline-first habit tracker installable as a PWA. Scope of this handoff is the **first screen only**: today's habit list with one-tap completion, a week strip, per-habit streaks, and a bottom-sheet "New habit" form. History, settings, auth, and sync are out of scope.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show intended look and behavior. They are **not production code to copy**. Recreate them in the target codebase using its existing framework, component library, and conventions. If there is no codebase yet, pick the framework (recommendation below) and implement the design there.

Recommended stack if starting fresh: **Vite + React + TypeScript**, state in React + `localStorage` (or IndexedDB via `idb`), `vite-plugin-pwa` for the manifest/service worker. No UI library needed — the design is small and hand-styled.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, and transitions below are final. Recreate pixel-accurately at a 402×874 logical viewport (iPhone 14/15 class), then let it scale fluidly.

---

## Screen 1 — Today (home)

**Purpose:** the daily driver. See what's due today, mark it done, see the streak hold.

**Layout**
- Full-viewport column, background `#fcfcfb`.
- Scrollable content region: `padding: 54px 22px 124px` (top inset clears the status bar / notch; bottom inset clears the floating CTA).
- Fixed footer overlay pinned to the bottom: `padding: 18px 22px 24px`, background `linear-gradient(to top, #fcfcfb 58%, rgba(252,252,251,0))` so list content fades out under the button.

**Header row** — flex, `justify-content: space-between`, `align-items: flex-start`
- Left, eyebrow: today's date, `toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric'})`. Type: 400 11.5px, `letter-spacing .14em`, uppercase, `rgba(23,24,26,.38)`.
- Left, title: "Today" — 300 34px/1.1, `letter-spacing -.03em`, `#17181a`, `margin-top: 8px`.
- Right, counter: `{done}` in `#65a30d` + `/{total}` in `rgba(23,24,26,.25)`, 400 24px/1, `tabular-nums`, `letter-spacing -.02em`, `padding-top: 4px`.
- Right, label: "done" — 400 11px, `letter-spacing .08em`, uppercase, `rgba(23,24,26,.35)`, `margin-top: 7px`.

**Progress bar**
- `height 3px`, `border-radius 99px`, track `rgba(23,24,26,.07)`, fill `#65a30d`, `margin: 22px 0 26px`.
- Fill width = `round(done / total * 100)%`; `transition: width .45s cubic-bezier(.3,1.1,.4,1)`.

**Week strip** — flex, `gap 7px`, `margin-bottom 30px`. Seven equal columns, Sunday-first, dates = current week (`now.getDate() - (todayIdx - i)`).
- Column: flex column, `align-items center`, `gap 9px`.
- Day letter: 400 11px. Today `#65a30d`; else `rgba(23,24,26,.35)`.
- Date cell: `width 100%`, `height 32px`, `border-radius 10px`, 400 12px `tabular-nums`, 1px border.
  - Today: bg `color-mix(in oklab, #65a30d 12%, transparent)`, border `…45%…`, text `#65a30d`.
  - Past: bg `rgba(23,24,26,.035)`, border transparent, text `rgba(23,24,26,.5)`.
  - Future: bg transparent, border transparent, text `rgba(23,24,26,.25)`.

**Habit rows** — vertical flex, `gap 9px`. Each row: flex, `align-items center`, `gap 14px`, `border-radius 18px`, `padding 15px 15px 15px 18px`, 1px border, `transition: background .28s, border-color .28s`.
- Incomplete: bg `#fff`, border `rgba(23,24,26,.08)`, title `#17181a`.
- Complete: bg `color-mix(in oklab, #65a30d 6%, transparent)`, border `…26%…`, title `rgba(23,24,26,.42)` with `text-decoration: line-through`.
- Title: 400 16px/1.25, `letter-spacing -.015em`, single line, `text-overflow: ellipsis`.
- Meta row (`margin-top 9px`, flex, `align-items center`, `gap 10px`):
  1. **Dot trail** — 7 dots, `5×5px`, `border-radius 99px`, `gap 4px`, oldest→newest. Hit day: `#65a30d` when streak ≥ 20, else `rgba(23,24,26,.3)`. Miss: `rgba(23,24,26,.1)`.
  2. **Streak label** — `"{n} days"` (`"1 day"` singular, `"new"` when 0). 400 12px `tabular-nums`; `#65a30d` when streak ≥ 20, else `rgba(23,24,26,.45)`.
  3. Divider: `1×10px`, `rgba(23,24,26,.14)`.
  4. **Meta text** — 300 12px, `rgba(23,24,26,.4)`. For count habits shows `"{count} of {target}"`; otherwise the habit's own note ("Evening", "Weekdays", "5 min").
- **Check button** — `50×50px` circle, 1.5px border, 400 15px `tabular-nums`, `transition: background .2s, border-color .2s, transform .12s`, `:active { transform: scale(.9) }`.
  - Complete: bg + border `#65a30d`, glyph `✓` in `#fff`.
  - Partial (count > 0, below target): bg transparent, border `color-mix(in oklab, #65a30d 45%, transparent)`, label `"{count}/{target}"` in `#65a30d`.
  - Untouched: bg transparent, border `rgba(23,24,26,.16)`, empty (or `"0/{target}"` for count habits).
  - **44px minimum hit target is already satisfied at 50px — do not shrink it.**

**All-done message** — appears below the list when `done === total`: "Everything's done. See you tomorrow." 300 13.5px/1.5, `#65a30d`, centered, `margin-top 26px`, fade-and-rise in over 450ms.

**Primary CTA** — full width, `height 54px`, `border-radius 15px`, bg `#17181a`, text `#fcfcfb` 400 15.5px, `letter-spacing -.01em`; a 300-weight 20px "+" glyph then "New habit", `gap 10px`; `:active { transform: scale(.985) }`.

---

## Screen 2 — New habit (bottom sheet)

Opens over the home screen; the list stays visible behind a scrim.

- **Scrim:** `rgba(23,24,26,.3)`, fades in 220ms, tap to dismiss.
- **Sheet:** bottom-anchored, bg `#fff`, `border-radius 26px 26px 0 0`, `padding 11px 22px 30px`, `box-shadow 0 -14px 44px rgba(23,24,26,.14)`, `max-height 88%`, scrollable. Enters with `translateY(103%) → 0` over 320ms `cubic-bezier(.22,1,.36,1)`.
- **Grabber:** `36×4px`, `border-radius 99px`, `rgba(23,24,26,.13)`, centered, `margin-bottom 20px`.
- **Header:** "New habit" 300 24px/1.1, `letter-spacing -.03em`; right-side close button `32×32px` circle, bg `rgba(23,24,26,.05)`, "✕" 300 15px in `rgba(23,24,26,.5)`. `margin-bottom 24px`.
- **Field labels** (all): 400 10.5px, `letter-spacing .13em`, uppercase, `rgba(23,24,26,.38)`, 10px below.

**Fields**
1. **Habit** (text, required) — full width, `border-radius 13px`, `padding 15px 16px`, bg `#fcfcfb`, border `rgba(23,24,26,.12)` → `#65a30d` on focus, text 400 16.5px `letter-spacing -.015em`, placeholder "Read 20 pages". (16px+ font size avoids iOS focus zoom — keep it.)
2. **Repeat** — segmented control, 3 options: `Daily` (default) · `Weekdays` · `3× / week`. Track bg `rgba(23,24,26,.045)`, `padding 4px`, `border-radius 14px`, `gap 5px`. Segments flex-1, `border-radius 10px`, `padding 11px 0`, 400 13.5px. Selected: bg `#fff`, text `#17181a`, `box-shadow 0 1px 3px rgba(23,24,26,.1)`. Unselected: transparent, `rgba(23,24,26,.5)`.
3. **Times per day** — row with label "Times per day" (400 15.5px) + hint "For count habits, like glasses of water" (300 12.5px, `rgba(23,24,26,.42)`), and a stepper on the right: track bg `rgba(23,24,26,.045)`, `border-radius 12px`, `padding 4px`; − / + buttons `34×34px`, `border-radius 9px`, bg `#fff`, 300 18px; value 400 15px `tabular-nums`, min-width 26px. **Clamp 1–12.** Default 1.
4. **Remind me** — same row pattern, separated by `border-top: 1px solid rgba(23,24,26,.07)` with `padding-top 22px`. Hint text is state-dependent: "Every day at 8:00 PM" when on, "No notification" when off. Toggle: `50×31px` pill, `padding 3px`; knob `25×25px` white circle with `0 1px 3px rgba(23,24,26,.22)`; track `#65a30d` on / `rgba(23,24,26,.14)` off; `transition: background .22s`, knob moves via `justify-content` flip. Default **on**.
   - Note: the prototype does not schedule anything. Real implementation needs the Notifications + Push APIs (and on iOS, notifications only work once the PWA is installed to the home screen). Treat as a stub if push infra isn't ready.
5. **Submit** — "Create habit", full width `height 54px`, `border-radius 15px`, text `#fcfcfb` 400 15.5px. Enabled bg `#17181a`; disabled bg `rgba(23,24,26,.25)` with `cursor: not-allowed`. Enabled only when the trimmed name is non-empty.

---

## Interactions & Behavior

**Tap the check button** (the only completion gesture — no swipe, no long-press):
- Simple habit (`target === 1`), incomplete → `count = 1`, `streak += 1`, row flips to complete state.
- Count habit (`target > 1`) → `count += 1`. Streak increments only on the tap that reaches target.
- Already complete → **untap**: `count = 0`, `streak = max(0, streak - 1)`. This is the undo path; there is no separate undo affordance.
- The progress bar, the `done/total` counter, and the all-done message all derive from this — no separate state.

**Create habit** → append `{name: trimmed, streak: 0, target, count: 0, meta: freq, trail: [0,0,0,0,0,0,0]}`, close the sheet, reset the draft to defaults. New rows show "new" instead of a day count.

**Close sheet** → scrim tap or ✕. Draft is preserved in the prototype only until submit; decide whether real drafts should survive dismissal (recommend: discard).

**Not yet designed** (will need decisions): edit/delete a habit, reorder, history view, empty state when zero habits exist, and what happens at local midnight.

## State Management
```ts
type Habit = {
  id: number;
  name: string;
  streak: number;      // consecutive completed days
  target: number;      // 1 = simple, >1 = count habit
  count: number;       // today's progress, 0..target
  meta: string;        // display note / frequency label
  trail: number[];     // last 7 days, 1 = hit, 0 = miss, oldest first
};

type Draft = { name: string; freq: 'Daily' | 'Weekdays' | '3× / week'; target: number; reminder: boolean };
```
Component state: `habits: Habit[]`, `sheetOpen: boolean`, `draft: Draft`, `nextId: number`.

Derived (never stored): `done = habits.filter(h => h.count >= h.target).length`, `progress = done / habits.length`, `allDone`.

**Persistence for the real app** — the prototype keeps everything in memory. Production needs:
- Habit definitions and a **completion log keyed by local date** (`{habitId, 'YYYY-MM-DD', count}`), not just today's counter. `streak` and `trail` should be **computed from that log**, not stored — otherwise they drift.
- A day-rollover check on app focus/visibilitychange: if the stored "current day" ≠ today, reset counters and recompute streaks/trails.
- Everything local-first (localStorage is fine to start; IndexedDB if the log grows). No network required.

## Design Tokens
**Color**
- Accent / done: `#65a30d`
- Ink: `#17181a`
- Surface (screen): `#fcfcfb`  ·  Surface (card): `#ffffff`  ·  Field fill: `#fcfcfb`
- Text on dark: `#fcfcfb`
- Ink alphas: `.60` body · `.45` streak · `.42` complete title / hint · `.40` meta · `.38` label · `.35` week letter · `.25` disabled/future · `.16` ring border · `.14` divider, toggle off · `.13` grabber · `.12` field border · `.10` trail miss · `.08` card border · `.07` rule, progress track · `.045` control track · `.035` past day
- Accent mixes (`color-mix(in oklab, accent X%, transparent)`): 6% complete card bg · 12% today cell bg · 26% complete card border · 45% today cell border, partial ring border
- Scrim: `rgba(23,24,26,.3)`

**Type** — Outfit (Google Fonts), weights 300/400. 34px/300 screen title · 24px/300 sheet title · 24px/400 counter · 16.5px/400 input · 16px/400 habit name · 15.5px/400 row label & buttons · 13.5px/400 segment · 12.5px/300 hint · 12px/400 streak & week date · 11.5px/400 date eyebrow · 11px/400 week letter & "done" · 10.5px/400 field label. Tracking: `-.03em` on the two large titles, `-.015em` on names/inputs, `-.01em` on buttons, `+.14em/.13em/.08em` on uppercase labels. `font-variant-numeric: tabular-nums` on every number.

**Spacing** — 3 · 4 · 5 · 7 · 8 · 9 · 10 · 14 · 15 · 18 · 20 · 22 · 24 · 26 · 30 · 54 · 124 px. Screen gutter 22px.

**Radius** — 9 (stepper button) · 10 (segment, week cell) · 13 (input) · 14 (control track) · 15 (CTA) · 18 (habit card) · 26 (sheet top) · 99 (pills, dots, rings).

**Shadow** — sheet `0 -14px 44px rgba(23,24,26,.14)` · selected segment `0 1px 3px rgba(23,24,26,.1)` · toggle knob `0 1px 3px rgba(23,24,26,.22)`.

**Motion** — width `.45s cubic-bezier(.3,1.1,.4,1)` · card bg/border `.28s` · toggle `.22s` · ring `.2s` · press `.12s` `scale(.9)` on rings / `scale(.985)` on wide buttons · sheet in `.32s cubic-bezier(.22,1,.36,1)` · scrim `.22s` fade · all-done `.45s` fade+rise 6px.

## Assets
None — no images or icon set. Glyphs used are plain text characters: `✓`, `✕`, `+`, `−` (U+2212 minus, not a hyphen). If you'd rather ship real icons, swap in the codebase's existing icon library at the same optical sizes. Font: Outfit via Google Fonts (self-host for offline PWA correctness).

## PWA notes
- Manifest: `display: standalone`, `background_color`/`theme_color` `#fcfcfb`, portrait, maskable icon.
- Precache the app shell **and the font files** — a habit app must open with no network.
- Respect safe-area insets: the 54px top pad and 24px bottom pad in the design should become `env(safe-area-inset-*)`-aware in the real build.

## Files
- `Streaks - Habit Tracker.dc.html` — the design prototype (home screen + create sheet, fully interactive; open in a browser).
- `ios-frame.jsx` — device bezel used only to present the mock. **Not part of the app.**
- `support.js` — prototype runtime. **Not part of the app.**
