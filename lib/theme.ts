'use client'

export type THEME = 'system' | 'light' | 'dark'
const THEME_KEY = 'streaks.theme'
export const THEME_OPTIONS: THEME[] = ['system', 'light', 'dark']

export function readTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY)
    return savedTheme || 'system'
}

export function saveTheme(theme: THEME) {
    if (theme === 'system') {
        localStorage.removeItem(THEME_KEY)
        return
    }
    localStorage.setItem(THEME_KEY, theme)
}

export function applyTheme(theme: THEME) {
    saveTheme(theme)
    document.documentElement.setAttribute('data-theme', theme)
}