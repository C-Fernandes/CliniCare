import { api, unwrapResponse } from './api';
import type { ApiResponse, PageResponse } from '../types/api';
import type { User, UserFormData } from '../types/user';

export async function getUsers() {
    return unwrapResponse(
        await api.get<ApiResponse<PageResponse<User>>>('/users', {
            params: { page: 0, size: 100, sort: 'createdAt,desc' },
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
