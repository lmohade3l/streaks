import s from './Button.module.css'

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: 'primary' | 'outlined' | 'icon'
}

export default function Button({ variant = 'primary', children, ...props }: ButtonProps) {
    return (
        <button
            type={props?.type ?? 'button'}
            className={`${s[variant]}`}
            {...props}
        >
            {children}
        </button>
    )
}