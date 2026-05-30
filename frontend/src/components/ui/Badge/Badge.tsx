import type { HTMLAttributes, ReactNode } from 'react';

import './Badge.scss';

type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'cyan';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    children: ReactNode;
    tone?: BadgeTone;
}

export function Badge({
    children,
    className = '',
    tone = 'neutral',
    ...props
}: BadgeProps) {
    return (
        <span className={`badge badge--${tone} ${className}`.trim()} {...props}>
            {children}
        </span>
    );
}
