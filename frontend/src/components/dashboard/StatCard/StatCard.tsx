import type { ReactNode } from 'react';

interface StatCardProps {
    icon: ReactNode;
    label: string;
    tone: 'blue' | 'green' | 'cyan' | 'red';
    value: string;
}

export function StatCard({ icon, label, tone, value }: StatCardProps) {
    return (
        <article className="stat-card">
            <div className={`stat-card__icon stat-card__icon--${tone}`}>
                {icon}
            </div>

            <div>
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
        </article>
    );
}
