# Streaks

A minimal habit tracker for the phone: today's habits, one tap to complete, and a
streak that holds. Installable as a PWA, local-first, no account needed.

**Live demo:** https://streaks-tau-brown.vercel.app

> This README is a short placeholder. A full version with screenshots, architecture
> notes and the reasoning behind them is in progress.

## What it does today

- One tap marks a habit done; tapping again undoes it.
- Count habits ("water, 6 glasses") fill up one tap at a time.
- Streaks and the 7-day trail are derived from a date-keyed completion log, never
  stored, so they cannot drift out of sync.
- Light, dark, or follow the system.
- Data stays in the browser (`localStorage`).

## Tech stack

Next.js (App Router) · React · TypeScript (strict) · CSS Modules · no UI library.

## Run it locally

```bash
npm install
npm run dev    # http://localhost:3000 — seeds sample habits in development
npm run build  # production build
```

## Design

The original design handoff and HTML prototype live in [`docs/design/`](docs/design/).
