import { api, unwrapResponse } from './api';
import type { ApiResponse, PageRequest, PageResponse } from '../types/api';
import type { User, UserFormData } from '../types/user';

export async function getUsers(params: PageRequest = {}) {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<User>>>('/users', {
            params: { page: 0, size: 10, sort: 'createdAt,desc', ...params },
        })
    );
}

export async function createUser(data: UserFormData) {
    return unwrapResponse(await api.post<ApiResponse<User>>('/users', data));
}

export async function updateUser(id: number, data: UserFormData) {
    return unwrapResponse(await api.put<ApiResponse<User>>(`/users/${id}`, data));
}

export async function deleteUser(id: number) {
    await api.delete(`/users/${id}`);
}

export async function approveUser(id: number) {
    return unwrapResponse(await api.patch<ApiResponse<User>>(`/users/${id}/approve`));
}

export async function rejectUser(id: number) {
    return unwrapResponse(await api.patch<ApiResponse<User>>(`/users/${id}/reject`));
}
