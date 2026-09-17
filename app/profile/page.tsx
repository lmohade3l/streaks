'use client'

import { readTheme, applyTheme, THEME, THEME_OPTIONS } from '@/lib/theme'
import s from './Profile.module.css'
import ChevronRight from '@/public/icons/chevron-right.svg'
import { useEffect, useState } from 'react'

export default function Profile() {
    const [theme , setTheme] = useState<THEME | ''>('')
    
    useEffect(() => {
        const active = readTheme()
        setTheme(active)
    } ,[])

    const handleChangeTheme = (theme: THEME) => {
        setTheme(theme)
        applyTheme(theme)
    }
    
    return (
        <main className={s.screen}>
            <div className={s.scroll}>
                <div>
                    <div className={s.eyebrow}>Settings</div>
                    <div className={s.title}>Profile</div>
                </div>

                <div className={s.itemsContainer}>
                    {/* theme */}
                    <div className={s.itemBox}>
                        <div className={s.itemLabel}>Theme</div>
                        <div className={s.itemSupport}>System follows your device setting</div>
                        <div className={s.themeOptionsContainer}>
                            {THEME_OPTIONS.map((o) => (
                                <button onClick={() => handleChangeTheme(o)} key={o} className={`${s.themeOption} ${o===theme ? s.active : ''}`}>{o}</button>
                            ))}
                        </div>
                    </div>
                    
                    <div className={s.divider}/>

                    {/* end of the day */}
                    <div className={s.itemBox}>
                        <div className={s.list}>
                            <div className={s.listLeadingContainer}>
                                <div className={s.itemLabel}>End of day</div>
                                <div className={s.itemSupport}>When a day rolls over</div>
                            </div>

                            <div className={s.listTrailingContainer}>
                                <div>{'3:00 AM'}</div>
                                <ChevronRight />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}