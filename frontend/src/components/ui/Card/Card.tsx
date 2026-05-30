import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

import './Card.scss';

type CardProps<T extends ElementType = 'section'> = {
    as?: T;
    children: ReactNode;
    className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function Card<T extends ElementType = 'section'>({
    as,
    children,
    className = '',
    ...props
}: CardProps<T>) {
    const Component = as ?? 'section';

    return (
        <Component className={`card ${className}`.trim()} {...props}>
            {children}
        </Component>
    );
}
