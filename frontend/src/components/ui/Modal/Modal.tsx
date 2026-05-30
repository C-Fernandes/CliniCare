import type { ReactNode } from 'react';
import { X } from 'lucide-react';

import { IconButton } from '../IconButton/IconButton';
import './Modal.scss';

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title: string;
    className?: string;
    headerClassName?: string;
    overlayClassName?: string;
    size?: 'sm' | 'lg';
}

export function Modal({
    children,
    isOpen,
    onClose,
    title,
    className = '',
    headerClassName = '',
    overlayClassName = '',
    size = 'sm',
}: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className={`modal-overlay ${overlayClassName}`.trim()}>
            <div className={`modal modal--${size} ${className}`.trim()}>
                <div className={`modal__header ${headerClassName}`.trim()}>
                    <h2>{title}</h2>
                    <IconButton label="Fechar modal" onClick={onClose}>
                        <X size={20} />
                    </IconButton>
                </div>

                {children}
            </div>
        </div>
    );
}
