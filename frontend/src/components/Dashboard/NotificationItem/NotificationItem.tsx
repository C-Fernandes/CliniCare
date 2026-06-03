import { Badge } from '../../UI';

interface NotificationItemProps {
    date: string;
    onClick: () => void;
    patient: string;
    priority: string;
    priorityTone: 'success' | 'warning' | 'danger';
    title: string;
}

export function NotificationItem({
    date,
    onClick,
    patient,
    priority,
    priorityTone,
    title,
}: NotificationItemProps) {
    return (
        <button className="notification-item dashboard-link-item" onClick={onClick} type="button">
            <div className="notification-item__header">
                <div>
                    <span className="notification-item__dot" />
                    <strong>{title}</strong>
                </div>

                <Badge tone={priorityTone}>{priority}</Badge>
            </div>

            <p>
                {patient} · {date}
            </p>
        </button>
    );
}
