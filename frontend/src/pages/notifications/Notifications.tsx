import { useEffect, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Notifications.scss';
import { Badge, Button, Card, Pagination } from '../../components/UI';
import {
    getNotifications,
    getNotificationsByPriority,
    getUnreadNotifications,
    markNotificationAsRead,
} from '../../services/notifications';
import { getApiError } from '../../services/api';
import type { Notification, NotificationPriority } from '../../types/notification';
import { formatDateTime } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

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
    const navigate = useNavigate();
    const [filter, setFilter] = useState<NotificationFilter>('ALL');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { showToast } = useToast();

    useEffect(() => {
        async function loadNotifications(currentFilter: NotificationFilter) {
            try {
                setIsLoading(true);
                setError('');

                const response =
                    currentFilter === 'UNREAD'
                        ? await getUnreadNotifications({ page, size: 10 })
                        : currentFilter === 'HIGH'
                            ? await getNotificationsByPriority('HIGH', { page, size: 10 })
                            : await getNotifications({ page, size: 10 });

                setNotifications(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch {
                const message = 'Não foi possível carregar as notificações.';
                setError(message);
                showToast({ message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadNotifications(filter);
    }, [filter, page, showToast]);

    async function handleMarkAsRead(id: number) {
        try {
            await markNotificationAsRead(id);
            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification.id === id
                        ? { ...notification, readStatus: true }
                        : notification
                )
            );
            showToast({ message: 'Notificação marcada como lida.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, 'Não foi possível marcar a notificação como lida.'),
                type: 'error',
            });
        }
    }

    return (
        <div className="notifications-page">
            <section className="notifications-filters">
                <button
                    type="button"
                    className={filter === 'ALL' ? 'active' : ''}
                    onClick={() => { setFilter('ALL'); setPage(0); }}
                >
                    Todas
                </button>

                <button
                    type="button"
                    className={filter === 'UNREAD' ? 'active' : ''}
                    onClick={() => { setFilter('UNREAD'); setPage(0); }}
                >
                    Não lidas
                </button>

                <button
                    type="button"
                    className={filter === 'HIGH' ? 'active' : ''}
                    onClick={() => { setFilter('HIGH'); setPage(0); }}
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
                                disabled={!notification.patientId}
                                onClick={() => notification.patientId && navigate(`/patients/${notification.patientId}`)}
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

            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />
        </div>
    );
}
