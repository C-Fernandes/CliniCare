import axios from 'axios';
import type { ApiResponse } from '../types/api';
import { AUTH_STORAGE_KEY } from '../contexts/auth-context';
import i18n from '../i18n';

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
                    detail: { message: i18n.t('errors.expiredSession'), type: 'error' },
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
            return i18n.t('errors.expiredSession');
        }

        if (status === 403) {
            return i18n.t('errors.forbidden');
        }

        if (status === 404) {
            return i18n.t('errors.notFound');
        }

        if (status && status >= 500) {
            return i18n.t('errors.generic');
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
