import { api, unwrapResponse } from './api';
import type { ApiResponse, PageResponse } from '../types/api';
import type { Notification, NotificationPriority } from '../types/notification';

export async function getNotifications() {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications', {
            params: { page: 0, size: 100, sort: 'createdAt,desc' },
        })
    );
}

export async function getUnreadNotifications() {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications/unread', {
            params: { page: 0, size: 100, sort: 'createdAt,desc' },
        })
    );
}

export async function getNotificationsByPriority(priority: NotificationPriority) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications/filter/priority', {
            params: { priority, page: 0, size: 100, sort: 'createdAt,desc' },
        })
    );
}

export async function markNotificationAsRead(id: number) {
    await api.patch(`/notifications/${id}/read`);
}
