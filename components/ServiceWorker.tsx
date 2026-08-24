'use client';

import { useEffect } from 'react';

/** Same-origin build assets: hashed JS/CSS chunks and the self-hosted fonts. */
function assetsThisPageLoaded(): string[] {
  return performance
    .getEntriesByType('resource')
    .map((entry) => entry.name)
    .filter((url) => url.startsWith(`${location.origin}/_next/static/`));
}

/** Registers the offline shell. No-op in dev, where the SW only gets in the way. */
export default function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;

    let cancelled = false;

    const run = async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
        const registration = await navigator.serviceWorker.ready;
        // Wait for the fonts so their requests exist to be reported.
        await document.fonts.ready;
        if (cancelled) return;

        const worker = registration.active;
        if (worker) worker.postMessage({ type: 'cache-assets', urls: assetsThisPageLoaded() });
      } catch {
        // Offline support is a progressive enhancement; the app works without it.
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
