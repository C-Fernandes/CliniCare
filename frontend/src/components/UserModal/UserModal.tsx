import { useState } from 'react';

import './UserModal.scss';
import { Button, FormField, Modal } from '../ui';

export type UserRole = 'ADMIN' | 'PROFESSIONAL';

export interface UserFormData {
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
}

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (data: UserFormData) => void;
}

export function UserModal({ isOpen, onClose, onCreateUser }: UserModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('PROFESSIONAL');
    const [active, setActive] = useState(true);

    if (!isOpen) {
        return null;
    }

    function resetForm() {
        setName('');
        setEmail('');
        setRole('PROFESSIONAL');
        setActive(true);
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        onCreateUser({
            name,
            email,
            role,
            active,
        });

        resetForm();
        onClose();
    }

    function handleClose() {
        resetForm();
        onClose();
    }

    return (
        <Modal
            className="user-modal"
            headerClassName="user-modal__header"
            isOpen={isOpen}
            onClose={handleClose}
            overlayClassName="user-modal-overlay"
            title="Novo usuário"
        >
            <form onSubmit={handleSubmit}>
                <FormField
                    htmlFor="name"
                    label="Nome"
                    controlProps={{
                        autoFocus: true,
                        onChange: (event) => setName(event.target.value),
                        required: true,
                        type: 'text',
                        value: name,
                    }}
                />

                <FormField
                    htmlFor="email"
                    label="Email"
                    controlProps={{
                        onChange: (event) => setEmail(event.target.value),
                        required: true,
                        type: 'email',
                        value: email,
                    }}
                />

                <FormField
                    htmlFor="role"
                    label="Perfil"
                    controlProps={{
                        as: 'select',
                        children: (
                            <>
                                <option value="PROFESSIONAL">Profissional</option>
                                <option value="ADMIN">Administrador</option>
                            </>
                        ),
                        onChange: (event) => setRole(event.target.value as UserRole),
                        value: role,
                    }}
                />

                <FormField
                    htmlFor="status"
                    label="Status"
                    controlProps={{
                        as: 'select',
                        children: (
                            <>
                                <option value="ACTIVE">Ativo</option>
                                <option value="INACTIVE">Inativo</option>
                            </>
                        ),
                        onChange: (event) => setActive(event.target.value === 'ACTIVE'),
                        value: active ? 'ACTIVE' : 'INACTIVE',
                    }}
                />

                <div className="user-modal__actions">
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>

                    <Button type="submit">Criar usuário</Button>
                </div>
            </form>
        </Modal>
    );
}
