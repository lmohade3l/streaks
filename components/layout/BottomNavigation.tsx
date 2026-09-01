import AddFilled from '@/public/icons/add-filled.svg'
import AddOutlined from '@/public/icons/add-outline.svg'
import HomeFilled from '@/public/icons/home-filled.svg'
import HomeOutlined from '@/public/icons/home-outline.svg'
import ProfileFilled from '@/public/icons/profile-filled.svg'
import ProfileOutlined from '@/public/icons/profile-outline.svg'
import s from './ButtomNavigation.module.css'
import Image from 'next'

export default function BottomNavigation(){

    const navigationItems = [
        {
            label: 'Home',
            icon: HomeOutlined,
            fillIcon: HomeFilled
        },
        {
            label: 'Add',
            icon: AddOutlined,
            fillIcon: AddFilled
        },
        {
            label: 'Profile',
            icon: ProfileOutlined,
            fillIcon: ProfileFilled
        },
    ]

    return (
        <div className={s.container}>
            <div className={s.innerContainer}>
                {navigationItems?.map(n => (
                    <div>
                        <img width={30} src={n.icon}/>
                        <p>{n.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}