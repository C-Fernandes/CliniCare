import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './Button.scss';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    icon?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
}

export function Button({
    children,
    className = '',
    icon,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    type = 'button',
    ...props
}: ButtonProps) {
    const classes = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth ? 'button--full' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} type={type} {...props}>
            {icon}
            <span>{children}</span>
        </button>
    );
}
