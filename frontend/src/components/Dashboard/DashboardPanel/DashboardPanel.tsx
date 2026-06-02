import type { ReactNode } from 'react';

import { Card } from '../../UI';

interface DashboardPanelProps {
    children: ReactNode;
    title: string;
}

export function DashboardPanel({ children, title }: DashboardPanelProps) {
    return (
        <Card as="article" className="dashboard-card">
            <h2>{title}</h2>
            {children}
        </Card>
    );
}
