'use client'

import AddFilled from '@/public/icons/add-filled.svg'
import AddOutlined from '@/public/icons/add-outline.svg'
import HomeFilled from '@/public/icons/home-filled.svg'
import HomeOutlined from '@/public/icons/home-outline.svg'
import ProfileFilled from '@/public/icons/profile-filled.svg'
import ProfileOutlined from '@/public/icons/profile-outline.svg'
import s from './ButtomNavigation.module.css'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
    {
        label: 'Home',
        icon: HomeOutlined,
        fillIcon: HomeFilled,
        href: '/',
    },
    {
        label: 'Add',
        icon: AddOutlined,
        fillIcon: AddFilled,
        href: '/add',
    },
    {
        label: 'Profile',
        icon: ProfileOutlined,
        fillIcon: ProfileFilled,
        href: '/profile',
    },
]

export default function BottomNavigation() {
    const pathname = usePathname()

    return (
        <div className={s.container}>
            <div className={s.innerContainer}>
                {navigationItems.map((n) => {
                    const Icon = pathname === n.href ? n.fillIcon : n.icon;
                    return (
                        <Link style={{color:'#FFF'}} key={n.label} href={n.href} className={s.item}>
                            <Icon width={24} height={24} />
                            <span>{n.label}</span>
                        </Link>
                    );
                })}

            </div>
        </div>
    )
}
