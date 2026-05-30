import axios from 'axios';
import type { ApiResponse } from '../types/api';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
});

export function unwrapResponse<T>(response: { data: ApiResponse<T> }) {
    return response.data.data;
}
