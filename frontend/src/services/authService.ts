import type { ApiResponse } from "../types/api";
import type { LoginRequest, LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const body: ApiResponse<LoginResponse> = await response.json();

    if (!response.ok || !body.success) {
        throw new Error(body.error ?? 'Erro ao realizar login.');
    }

    return body.data;
}