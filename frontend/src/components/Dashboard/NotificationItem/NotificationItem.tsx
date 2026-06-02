import { Badge } from '../../UI';

interface NotificationItemProps {
    date: string;
    onClick: () => void;
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
    onClick,
    patient,
    priority,
    title,
}: NotificationItemProps) {
    return (
        <button className="notification-item dashboard-link-item" onClick={onClick} type="button">
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
        </button>
    );
}
