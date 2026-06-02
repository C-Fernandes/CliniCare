import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastPayload {
    message: string;
    type?: ToastType;
}

export interface ToastContextData {
    showToast: (toast: ToastPayload) => void;
}

export const ToastContext = createContext<ToastContextData | undefined>(undefined);
