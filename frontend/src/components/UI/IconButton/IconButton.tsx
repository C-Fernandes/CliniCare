import type { ButtonHTMLAttributes, ReactNode } from 'react';

import './IconButton.scss';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    label: string;
}

export function IconButton({
    children,
    className = '',
    label,
    type = 'button',
    title,
    ...props
}: IconButtonProps) {
    return (
        <button
            aria-label={label}
            className={`icon-button ${className}`.trim()}
            title={title ?? label}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
}
