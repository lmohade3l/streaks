# 1. Keep app state in an external store, read with `useSyncExternalStore`

- **Status:** Accepted
- **Date:** 2026-11-22

*I wrote this record after the store was already in place, so the alternatives below
are ones I weighed later, not ones I compared at the time.*

## Context

Streaks is a local-first habit tracker built on Next.js (App Router) and React 19.
Its state is a list of habits and a completion log, persisted in `localStorage`.
Several things shaped how that state is held:

- Two routes, Today and `/add`, use the same data. A habit created on `/add` has to
  show up on Today immediately.
- Only the completion log is stored. Count, streak and the seven-day trail are
  derived from it on every read, so they cannot drift out of sync.
- Client components in the App Router are also rendered on the server, where there is
  no `window` and no `localStorage`. The first client render has to match the server
  HTML, or hydration fails.
- The app is long-lived on a phone. The visible day goes stale while the app sits in
  the background, and a second tab can write to the same storage.

## Decision

State lives in a small module outside React, `lib/store.ts`: one `snapshot` object and
a set of listeners. Every change goes through `commit`, which replaces the snapshot
with a new object, optionally saves it, and notifies the listeners.

React reads the store through `useSyncExternalStore`, in one hook (`lib/useHabits.ts`):

- `subscribe` and `getSnapshot` are the store's public API for React.
- `getServerSnapshot` returns an empty snapshot with `ready: false`. It is used for the
  server render and for the first client render, so the two match.
- Storage is read once, in an effect (`init`), never during render. Until then Today
  renders an empty shell. Without that, a user who has habits would see the empty state
  for a moment.
- Day rollover (visibility change, window focus and a midnight timer) and writes from
  another tab (the `storage` event) are handled in one place. A state adopted from
  another tab is not saved again.
- Derived values come from `lib/derive.ts`, computed from the log with `useMemo`.

## Alternatives considered

I weighed these after the fact.

- **`useState` and `useEffect` in each component.** The simplest option for a single
  screen. With two screens, each would hold its own copy of the data and I would have
  to keep the copies in sync. The state logic would also live inside components.
- **React Context with `useReducer`.** A valid and common choice. State sits in a
  provider at the root and changes through a reducer. It would work here. I preferred
  a store whose logic is plain functions and does not depend on the component tree.
- **A library such as Zustand.** It provides the same subscription mechanism with less
  code, and I would reach for it on a larger app. For an app this small I wanted to
  write the mechanism myself and understand it.

## Consequences

**Good**

- One source of truth for every screen.
- The state logic is plain TypeScript and can be tested without rendering React.
  The tests are planned and not written yet.
- Day rollover and multi-tab sync live in one place.

**Costs and known weaknesses**

- I maintain subscription code that a library would provide.
- The store is a module-level singleton. That is safe here because it is only written
  in the browser, but it would need care if it ever ran on the server.
- Data the store cannot read (corrupt JSON, or a different `version`) is treated as a
  first run and replaced by an empty state while the page loads, before any tap. I
  found this while reviewing the code. The planned fix is to stop overwriting data
  I cannot read, with tests that cover it.
- Persistence is synchronous `localStorage`. If a write fails (storage full or
  blocked), the error is swallowed: the session keeps working, but the data does not
  survive a reload.
- There are no automated tests yet.

**Revisit when** persistence stops being synchronous `localStorage`, for example when
storage becomes asynchronous or server-backed. The store would then talk to storage
through an interface instead of calling it directly.
