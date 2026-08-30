import s from './Button.module.css'

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: 'primary' | 'outlined' | 'icon'
}

const NEEDS_TAP_TARGET = { primary: false, outlined: true, icon: true };

export default function Button({ variant = 'primary', className = '', type = 'button', children, ...props }: ButtonProps) {
    return (
        <button
            type={type}
            className={[s[variant], NEEDS_TAP_TARGET[variant] && 'tapTarget', className]
                .filter(Boolean)
                .join(' ')}            {...props}
        >
            {children}
        </button>
    )
}