import { NextResponse } from 'next/server';

/**
 * Placeholder so the API surface exists from day one — future backend routes
 * (sync, push subscriptions, reminders) live alongside the UI under app/api.
 */
export function GET() {
  return NextResponse.json({ ok: true, service: 'streaks', time: new Date().toISOString() });
}
