import { api, unwrapResponse } from './api';
import type { ApiResponse, PageRequest, PageResponse } from '../types/api';
import type { Notification, NotificationPriority } from '../types/notification';

export async function getNotifications(params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications', {
            params: { page: 0, size: 100, sort: 'createdAt,desc', ...params },
        })
    );
}

export async function getUnreadNotifications(params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications/unread', {
            params: { page: 0, size: 10, sort: 'createdAt,desc', ...params },
        })
    );
}

export async function getNotificationsByPriority(priority: NotificationPriority, params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<Notification>>>('/notifications/filter/priority', {
            params: { priority, page: 0, size: 10, sort: 'createdAt,desc', ...params },
        })
    );
}

export async function markNotificationAsRead(id: number) {
    await api.patch(`/notifications/${id}/read`);
}
