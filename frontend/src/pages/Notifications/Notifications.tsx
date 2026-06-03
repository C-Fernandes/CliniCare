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
import { usePreferences } from '../../hooks/usePreferences';
import { getNotificationText } from '../../utils/notificationText';

type NotificationFilter = 'ALL' | 'UNREAD' | 'HIGH';

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
    const { t } = usePreferences();

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
                const message = t('notifications.loadError');
                setError(message);
                showToast({ message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadNotifications(filter);
    }, [filter, page, showToast, t]);

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
            showToast({ message: t('notifications.markReadSuccess'), type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, t('notifications.markReadError')),
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
                    {t('notifications.all')}
                </button>

                <button
                    type="button"
                    className={filter === 'UNREAD' ? 'active' : ''}
                    onClick={() => { setFilter('UNREAD'); setPage(0); }}
                >
                    {t('notifications.unread')}
                </button>

                <button
                    type="button"
                    className={filter === 'HIGH' ? 'active' : ''}
                    onClick={() => { setFilter('HIGH'); setPage(0); }}
                >
                    {t('notifications.highPriority')}
                </button>
            </section>

            <section className="notifications-list">
                {notifications.map((notification) => {
                    const notificationText = getNotificationText(notification, t);

                    return (
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

                                    <h2>{notificationText.title}</h2>

                                    <Badge
                                        className={`notification-priority notification-priority--${notification.priority.toLowerCase()}`}
                                        tone={priorityTones[notification.priority]}
                                    >
                                        {t(`priority.${notification.priority}`)}
                                    </Badge>
                                </div>

                                <p className="notification-card__message">
                                    {notificationText.message}
                                </p>

                                <p className="notification-card__meta">
                                    {notification.patientName ?? t('common.noPatient')} · {formatDateTime(notification.createdAt)}
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
                                        {t('actions.markAsRead')}
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
                                    {t('notifications.viewPatient')}
                                </Button>
                            </div>
                        </article>
                    );
                })}

                {(isLoading || error || notifications.length === 0) && (
                    <Card className="notifications-empty">
                        {isLoading ? t('common.loading') : error || t('notifications.empty')}
                    </Card>
                )}
            </section>

            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />
        </div>
    );
}
