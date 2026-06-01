import { api, unwrapResponse } from './api';
import type { ApiResponse } from '../types/api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export async function login(credentials: LoginRequest) {
    return unwrapResponse(await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials));
}

export async function register(data: { name: string; email: string; password: string }) {
    await api.post('/auth/register', data);
}

export async function requestPasswordReset(email: string) {
    await api.post('/auth/forgot-password', { email });
}

export async function resetPassword(token: string, password: string) {
    await api.post('/auth/reset-password', { token, password });
}
