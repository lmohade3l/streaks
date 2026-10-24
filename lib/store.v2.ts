import type { AppState } from "./types.v2";

const HABITS_STATE_KEY = 'streaks.state'

export function save(state: AppState) {
    try {
        localStorage.setItem(HABITS_STATE_KEY, JSON.stringify(state))
    } catch {
        // deliberately left empty to not cause the app to crash
    }
}

export function load(): AppState | null {
    try {
        const savedState = localStorage.getItem(HABITS_STATE_KEY)
        if (!savedState) return null;
        const parsedState = JSON.parse(savedState)

        // check for valid state
        if (parsedState.version !== 1) return null
        if (!Array.isArray(parsedState.habits)) return null

        return parsedState
    } catch (err) {
        return null
    }
}