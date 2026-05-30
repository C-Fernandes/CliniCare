import { Badge } from '../../ui';

interface NotificationItemProps {
    date: string;
    patient: string;
    priority: string;
    title: string;
}

const priorityTones: Record<string, 'success' | 'warning' | 'danger'> = {
    Baixa: 'success',
    Média: 'warning',
    Alta: 'danger',
};

export function NotificationItem({
    date,
    patient,
    priority,
    title,
}: NotificationItemProps) {
    return (
        <div className="notification-item">
            <div className="notification-item__header">
                <div>
                    <span className="notification-item__dot" />
                    <strong>{title}</strong>
                </div>

                <Badge tone={priorityTones[priority]}>{priority}</Badge>
            </div>

            <p>
                {patient} · {date}
            </p>
        </div>
    );
}
