import s from './Button.module.css'

type ButtonProps = React.ComponentProps<'button'> & {
    variant?: 'primary' | 'chip' | 'icon'
}

export default function Button({ variant = 'primary', children, ...props }: ButtonProps) {
    return (
        <button
            type={props?.type ?? 'button'}
            className={`${s.primary}`}
            {...props}
        >
            {children}
        </button>
    )
}