import { useState } from 'react';
import { Pencil, Plus, Power } from 'lucide-react';


import './Users.scss';
import { UserModal, type UserFormData, type UserRole } from '../../components/UserModal/UserModal';
import { Badge, Button, DataTable, IconButton } from '../../components/UI';

interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    active: boolean;
    createdAt: string;
}

const usersMock: User[] = [
    {
        id: 1,
        name: 'Dra. Ana Costa',
        email: 'ana.costa@clinicare.com',
        role: 'ADMIN',
        active: true,
        createdAt: '10/01/2025',
    },
    {
        id: 2,
        name: 'Dr. Pedro Henrique',
        email: 'pedro.henrique@clinicare.com',
        role: 'PROFESSIONAL',
        active: true,
        createdAt: '05/03/2025',
    },
    {
        id: 3,
        name: 'Dra. Mariana Lopes',
        email: 'mariana.lopes@clinicare.com',
        role: 'PROFESSIONAL',
        active: true,
        createdAt: '12/04/2025',
    },
    {
        id: 4,
        name: 'Carlos Mendes',
        email: 'carlos.mendes@clinicare.com',
        role: 'PROFESSIONAL',
        active: false,
        createdAt: '01/12/2024',
    },
];

const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    PROFESSIONAL: 'Profissional',
};

const roleTones: Record<UserRole, 'primary' | 'cyan'> = {
    ADMIN: 'primary',
    PROFESSIONAL: 'cyan',
};

export function Users() {
    const [users, setUsers] = useState<User[]>(usersMock);
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleCreateUser(data: UserFormData) {
        const newUser: User = {
            id: users.length + 1,
            name: data.name,
            email: data.email,
            role: data.role,
            active: data.active,
            createdAt: new Date().toLocaleDateString('pt-BR'),
        };

        setUsers((currentUsers) => [...currentUsers, newUser]);
    }

    function handleToggleActive(id: number) {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user.id === id ? { ...user, active: !user.active } : user
            )
        );
    }

    return (
        <div className="users-page">
            <div className="users-header">
                <Button
                    className="users-new-button"
                    icon={<Plus size={18} />}
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                >
                    Novo usuário
                </Button>
            </div>

            <DataTable tableClassName="users-table" wrapperClassName="users-table-card">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Status</th>
                        <th>Criado em</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <strong>{user.name}</strong>
                            </td>

                            <td>{user.email}</td>

                            <td>
                                <Badge
                                    className={`user-role user-role--${user.role.toLowerCase()}`}
                                    tone={roleTones[user.role]}
                                >
                                    {roleLabels[user.role]}
                                </Badge>
                            </td>

                            <td>
                                <Badge
                                    className={`user-status ${user.active ? 'user-status--active' : 'user-status--inactive'
                                        }`}
                                    tone={user.active ? 'success' : 'neutral'}
                                >
                                    {user.active ? 'Ativo' : 'Inativo'}
                                </Badge>
                            </td>

                            <td>{user.createdAt}</td>

                            <td>
                                <div className="users-actions">
                                    <IconButton label="Editar usuário">
                                        <Pencil size={18} />
                                    </IconButton>

                                    <IconButton
                                        label={user.active ? 'Inativar usuário' : 'Ativar usuário'}
                                        onClick={() => handleToggleActive(user.id)}
                                    >
                                        <Power size={18} />
                                    </IconButton>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </DataTable>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateUser={handleCreateUser}
            />
        </div>
    );
}
