import { api, unwrapResponse } from './api';
import type { ApiResponse } from '../types/api';
import type { User } from '../types/user';

export interface LoginCredentials {
    email: string;
    password: string;
}

export async function login(credentials: LoginCredentials) {
    return unwrapResponse(await api.post<ApiResponse<User>>('/auth/login', credentials));
}
