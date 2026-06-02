import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { CheckCircle, Info, X, XCircle } from 'lucide-react';

import { ToastContext, type ToastPayload, type ToastType } from '../contexts/toast-context';
import './ToastProvider.scss';

interface ToastProviderProps {
    children: ReactNode;
}

interface Toast extends ToastPayload {
    id: number;
    type: ToastType;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((toast: ToastPayload) => {
        const id = Date.now();
        setToasts((currentToasts) => [
            ...currentToasts,
            { id, message: toast.message, type: toast.type ?? 'info' },
        ]);
    }, []);

    useEffect(() => {
        const listener = (event: Event) => {
            const { message, type } = (event as CustomEvent<ToastPayload>).detail;
            showToast({ message, type });
        };

        window.addEventListener('clinicare:toast', listener);
        return () => window.removeEventListener('clinicare:toast', listener);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-stack" role="status" aria-live="polite">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, 4500);
        return () => window.clearTimeout(timeout);
    }, [onClose]);

    const Icon = toast.type === 'success' ? CheckCircle : toast.type === 'error' ? XCircle : Info;

    return (
        <div className={`toast toast--${toast.type}`}>
            <Icon size={18} />
            <p>{toast.message}</p>
            <button type="button" aria-label="Fechar notificação" onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
}
