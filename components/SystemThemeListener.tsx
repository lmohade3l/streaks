'use client'

import { applyTheme, readTheme } from '@/lib/theme'
import { useEffect } from 'react'

export function SystemThemeListener() {
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)')

        const handler = () => {
            const savedTheme = readTheme()
            if (savedTheme === 'system') applyTheme('system')
        }

        media.addEventListener('change', handler)

        return () => {
            media.removeEventListener('change', handler)
        }
    }, [])

    return null;
}