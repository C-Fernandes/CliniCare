export type UserRole = 'ADMIN' | 'PROFESSIONAL';

export interface AuthUser {
    userId: number;
    name: string;
    email: string;
    role: UserRole;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    userId: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error: string | null;
}