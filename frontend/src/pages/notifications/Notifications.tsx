import { useEffect, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';

import './Notifications.scss';
import { Badge, Button, Card } from '../../components/UI';
import {
    getNotifications,
    getNotificationsByPriority,
    getUnreadNotifications,
    markNotificationAsRead,
} from '../../services/notifications';
import type { Notification, NotificationPriority } from '../../types/notification';
import { formatDateTime } from '../../utils/formatters';

type NotificationFilter = 'ALL' | 'UNREAD' | 'HIGH';

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
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadNotifications(currentFilter: NotificationFilter) {
            try {
                setIsLoading(true);
                setError('');

                const response =
                    currentFilter === 'UNREAD'
                        ? await getUnreadNotifications()
                        : currentFilter === 'HIGH'
                            ? await getNotificationsByPriority('HIGH')
                            : await getNotifications();

                setNotifications(response.content);
            } catch {
                setError('Não foi possível carregar as notificações.');
            } finally {
                setIsLoading(false);
            }
        }

        loadNotifications(filter);
    }, [filter]);

    async function handleMarkAsRead(id: number) {
        await markNotificationAsRead(id);
        setNotifications((currentNotifications) =>
            currentNotifications.map((notification) =>
                notification.id === id
                    ? { ...notification, readStatus: true }
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
                {notifications.map((notification) => (
                    <article
                        key={notification.id}
                        className={`notification-card ${!notification.readStatus ? 'notification-card--unread' : ''
                            }`}
                    >
                        <div className="notification-card__content">
                            <div className="notification-card__title">
                                <span
                                    className={`notification-card__dot ${notification.readStatus ? 'notification-card__dot--read' : ''
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
                                {notification.patientName ?? 'Sem paciente'} · {formatDateTime(notification.createdAt)}
                            </p>
                        </div>

                        <div className="notification-card__actions">
                            {!notification.readStatus && (
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

                {(isLoading || error || notifications.length === 0) && (
                    <Card className="notifications-empty">
                        {isLoading ? 'Carregando notificações...' : error || 'Nenhuma notificação encontrada.'}
                    </Card>
                )}
            </section>
        </div>
    );
}
