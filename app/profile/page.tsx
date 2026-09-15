import { THEME_OPTIONS } from '@/lib/theme'
import s from './Profile.module.css'

export default function Profile() {
    const active = THEME_OPTIONS[0]
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
                        <p className={s.itemLabel}>Theme</p>
                        <p className={s.itemSupport}>System follows your device setting</p>
                        <div className={s.themeOptionsContainer}>
                            {THEME_OPTIONS?.map((o) => (
                                <div key={o} className={`${s.themeOption} ${o===active ? s.active : ''}`}>{o}</div>
                            ))}
                        </div>
                    </div>
                    

                    {/* end of the day */}
                    <div className={s.itemBox}>

                    </div>
                </div>
            </div>
        </main>
    )
}