import axios from 'axios';
import type { ApiResponse } from '../types/api';
import { AUTH_STORAGE_KEY } from '../contexts/auth-context';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

api.interceptors.request.use((config) => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (storedUser) {
        const { token } = JSON.parse(storedUser) as { token?: string };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(AUTH_STORAGE_KEY);

            if (!error.config?.url?.includes('/auth/login')) {
                window.dispatchEvent(new CustomEvent('clinicare:toast', {
                    detail: { message: 'Sua sessão expirou. Faça login novamente.', type: 'error' },
                }));
                window.setTimeout(() => window.location.assign('/login'), 600);
            }
        }

        return Promise.reject(error);
    }
);

export function unwrapResponse<T>(response: { data: ApiResponse<T> }) {
    return response.data.data;
}

export function getApiError(error: unknown, fallback: string) {
    if (!axios.isAxiosError<ApiResponse<unknown>>(error)) {
        return fallback;
    }

    const status = error.response?.status;
    const apiMessage = error.response?.data.message;
    const apiError = error.response?.data.error;
    const candidate = typeof apiError === 'string' ? apiError : apiMessage;

    if (!candidate || isTechnicalErrorMessage(candidate)) {
        if (status === 401) {
            return 'Sua sessão expirou. Faça login novamente.';
        }

        if (status === 403) {
            return 'Você não tem permissão para realizar esta ação.';
        }

        if (status === 404) {
            return 'Registro não encontrado.';
        }

        if (status && status >= 500) {
            return 'Não foi possível concluir a ação agora. Tente novamente em instantes.';
        }

        return fallback;
    }

    return candidate;
}

function isTechnicalErrorMessage(message: string) {
    const technicalFragments = [
        'No static resource',
        'Exception',
        'Stack trace',
        'could not',
        'Cannot',
        'Failed',
        'SQL',
        'JDBC',
        'Hibernate',
        'NullPointer',
        'undefined',
        'request',
    ];

    return technicalFragments.some((fragment) =>
        message.toLowerCase().includes(fragment.toLowerCase())
    );
}
