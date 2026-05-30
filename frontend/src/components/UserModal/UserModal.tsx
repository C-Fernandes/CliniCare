import { useState } from 'react';

import './UserModal.scss';
import { Button, FormField, Modal } from '../UI';
import type { UserFormData, UserRole } from '../../types/user';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateUser: (data: UserFormData) => Promise<void> | void;
}

export function UserModal({ isOpen, onClose, onCreateUser }: UserModalProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('PROFESSIONAL');

    if (!isOpen) {
        return null;
    }

    function resetForm() {
        setName('');
        setEmail('');
        setPassword('');
        setRole('PROFESSIONAL');
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        await onCreateUser({
            name,
            email,
            password,
            role,
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
                    htmlFor="password"
                    label="Senha"
                    controlProps={{
                        onChange: (event) => setPassword(event.target.value),
                        required: true,
                        type: 'password',
                        value: password,
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
