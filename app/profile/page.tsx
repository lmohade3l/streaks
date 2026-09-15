import { THEME_OPTIONS } from '@/lib/theme'
import s from './Profile.module.css'
import ChevronRight from '@/public/icons/chevron-right.svg'

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
                        <div className={s.itemLabel}>Theme</div>
                        <div className={s.itemSupport}>System follows your device setting</div>
                        <div className={s.themeOptionsContainer}>
                            {THEME_OPTIONS?.map((o) => (
                                <div key={o} className={`${s.themeOption} ${o===active ? s.active : ''}`}>{o}</div>
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