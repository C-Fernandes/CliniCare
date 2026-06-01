import { api, unwrapResponse } from './api';
import type { ApiResponse } from '../types/api';
import type { LoginRequest, LoginResponse } from '../types/auth';

export async function login(credentials: LoginRequest) {
    return unwrapResponse(await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials));
}
