import { THEME_OPTIONS } from '@/lib/theme'
import s from './Profile.module.css'

export default function Profile() {
    return (
        <main className={s.screen}>
            <div className={s.scroll}>
                <div>
                    <p className={s.title}>Settings</p>
                    <p className={s.subTitle}>Profile</p>
                </div>

                <div className={s.itemsContainer}>
                    {/* theme */}
                    <div className={s.itemBox}>
                        <p className={s.itemLabel}>Theme</p>
                        <p className={s.itemSupport}>System follows your device setting</p>
                        <div className={s.themeOptionsContainer}>
                            {THEME_OPTIONS?.map((o) => (
                                <div key={o} className={s.themeOption}>{o}</div>
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