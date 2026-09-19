import { PersistedState } from "./types"

const HABITS_STATE_KAY = 'streaks.state'

export function save(state: PersistedState) {

    localStorage.setItem(HABITS_STATE_KAY, JSON.stringify(state))
}

export function load() {
    try {
        const savedState = localStorage.getItem(HABITS_STATE_KAY)
        if(!savedState) return null;

        const parsedState = JSON.parse(savedState)

    } catch (err) {

    }
}