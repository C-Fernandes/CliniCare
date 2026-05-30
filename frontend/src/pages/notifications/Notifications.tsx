import { useMemo, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';

import './Notifications.scss';
import { Badge, Button, Card } from '../../components/ui';

type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH';

type NotificationFilter = 'ALL' | 'UNREAD' | 'HIGH';

interface Notification {
    id: number;
    title: string;
    message: string;
    patientName: string;
    date: string;
    priority: NotificationPriority;
    read: boolean;
}

const notificationsMock: Notification[] = [
    {
        id: 1,
        title: 'Nova evolução clínica registrada',
        message: 'Uma nova evolução foi registrada para Maria Silva.',
        patientName: 'Maria Silva',
        date: '28/05/2026, 07:30',
        priority: 'MEDIUM',
        read: false,
    },
    {
        id: 2,
        title: 'Evolução de alta prioridade',
        message: 'Foi registrada uma evolução de alto nível de atenção para João Pereira.',
        patientName: 'João Pereira',
        date: '25/05/2026, 12:00',
        priority: 'HIGH',
        read: false,
    },
    {
        id: 3,
        title: 'Paciente sem evolução recente',
        message: 'Roberto Souza está há mais de 30 dias sem evoluções.',
        patientName: 'Roberto Souza',
        date: '22/05/2026, 06:00',
        priority: 'LOW',
        read: true,
    },
    {
        id: 4,
        title: 'Nova evolução clínica registrada',
        message: 'Uma nova evolução foi registrada para Clara Nogueira.',
        patientName: 'Clara Nogueira',
        date: '20/05/2026, 11:00',
        priority: 'LOW',
        read: false,
    },
];

const priorityLabels: Record<NotificationPriority, string> = {
    LOW: 'Baixa',
    MEDIUM: 'Média',
    HIGH: 'Alta',
};

const priorityTones: Record<NotificationPriority, 'neutral' | 'cyan' | 'danger'> = {
    LOW: 'neutral',
    MEDIUM: 'cyan',
    HIGH: 'danger',
};

export function Notifications() {
    const [filter, setFilter] = useState<NotificationFilter>('ALL');
    const [notifications, setNotifications] = useState(notificationsMock);

    const filteredNotifications = useMemo(() => {
        return notifications.filter((notification) => {
            if (filter === 'UNREAD') {
                return !notification.read;
            }

            if (filter === 'HIGH') {
                return notification.priority === 'HIGH';
            }

            return true;
        });
    }, [filter, notifications]);

    function handleMarkAsRead(id: number) {
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    }

    return (
        <div className="notifications-page">
            <section className="notifications-filters">
                <button
                    type="button"
                    className={filter === 'ALL' ? 'active' : ''}
                    onClick={() => setFilter('ALL')}
                >
                    Todas
                </button>

                <button
                    type="button"
                    className={filter === 'UNREAD' ? 'active' : ''}
                    onClick={() => setFilter('UNREAD')}
                >
                    Não lidas
                </button>

                <button
                    type="button"
                    className={filter === 'HIGH' ? 'active' : ''}
                    onClick={() => setFilter('HIGH')}
                >
                    Alta prioridade
                </button>
            </section>

            <section className="notifications-list">
                {filteredNotifications.map((notification) => (
                    <article
                        key={notification.id}
                        className={`notification-card ${!notification.read ? 'notification-card--unread' : ''
                            }`}
                    >
                        <div className="notification-card__content">
                            <div className="notification-card__title">
                                <span
                                    className={`notification-card__dot ${notification.read ? 'notification-card__dot--read' : ''
                                        }`}
                                />

                                <h2>{notification.title}</h2>

                                <Badge
                                    className={`notification-priority notification-priority--${notification.priority.toLowerCase()}`}
                                    tone={priorityTones[notification.priority]}
                                >
                                    {priorityLabels[notification.priority]}
                                </Badge>
                            </div>

                            <p className="notification-card__message">
                                {notification.message}
                            </p>

                            <p className="notification-card__meta">
                                {notification.patientName} · {notification.date}
                            </p>
                        </div>

                        <div className="notification-card__actions">
                            {!notification.read && (
                                <Button
                                    type="button"
                                    className="notification-action-button"
                                    icon={<Check size={16} />}
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleMarkAsRead(notification.id)}
                                >
                                    Marcar como lida
                                </Button>
                            )}

                            <Button
                                className="notification-link-button"
                                icon={<ExternalLink size={16} />}
                                size="sm"
                                variant="ghost"
                            >
                                Ver paciente
                            </Button>
                        </div>
                    </article>
                ))}

                {filteredNotifications.length === 0 && (
                    <Card className="notifications-empty">
                        Nenhuma notificação encontrada.
                    </Card>
                )}
            </section>
        </div>
    );
}
