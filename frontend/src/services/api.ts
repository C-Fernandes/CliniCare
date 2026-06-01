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
        }

        return Promise.reject(error);
    }
);

export function unwrapResponse<T>(response: { data: ApiResponse<T> }) {
    return response.data.data;
}
