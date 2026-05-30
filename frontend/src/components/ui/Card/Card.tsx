import type { HTMLAttributes, ReactNode } from 'react';

import './Card.scss';

interface CardProps extends HTMLAttributes<HTMLElement> {
    children: ReactNode;
    as?: 'article' | 'section' | 'div';
}

export function Card({
    as: Component = 'section',
    children,
    className = '',
    ...props
}: CardProps) {
    return (
        <Component className={`card ${className}`.trim()} {...props}>
            {children}
        </Component>
    );
}
