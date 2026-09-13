type THEME = 'system' | 'light' | 'dark'
const THEME_KEY = 'streaks.theme'
export const THEME_OPTIONS: THEME[] = ['system', 'light', 'dark']

export function readTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY)
    return savedTheme || 'system'
}

export function saveTheme(t: THEME) {
    if (t === 'system') {
        localStorage.removeItem(THEME_KEY)
        return
    }
    localStorage.setItem(THEME_KEY, t)
}

export function applyTheme() {

}