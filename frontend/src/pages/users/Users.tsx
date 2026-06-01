import { useEffect, useState } from 'react';
import { Pencil, Plus, Power } from 'lucide-react';


import './Users.scss';
import { UserModal } from '../../components/UserModal/UserModal';
import { Badge, Button, DataTable, IconButton } from '../../components/UI';
import {
    createUser,
    deleteUser,
    getUsers,
    updateUser,
} from '../../services/users';
import type { User, UserFormData, UserRole } from '../../types/user';
import { formatDate } from '../../utils/formatters';

const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    PROFESSIONAL: 'Profissional',
};

const roleTones: Record<UserRole, 'primary' | 'cyan'> = {
    ADMIN: 'primary',
    PROFESSIONAL: 'cyan',
};

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                setError('');
                const response = await getUsers();
                setUsers(response.content);
            } catch {
                setError('Não foi possível carregar os usuários.');
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, []);

    async function handleSaveUser(data: UserFormData) {
        if (selectedUser) {
            const updatedUser = await updateUser(selectedUser.id, data);
            setUsers((currentUsers) =>
                currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user)
            );
            return;
        }

        const newUser = await createUser(data);
        setUsers((currentUsers) => [...currentUsers, newUser]);
    }

    function openCreateUserModal() {
        setSelectedUser(null);
        setIsModalOpen(true);
    }

    function openEditUserModal(user: User) {
        setSelectedUser(user);
        setIsModalOpen(true);
    }

    function closeUserModal() {
        setSelectedUser(null);
        setIsModalOpen(false);
    }

    async function handleDeleteUser(id: number) {
        await deleteUser(id);
        setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
    }

    return (
        <div className="users-page">
            <div className="users-header">
                <Button
                    className="users-new-button"
                    icon={<Plus size={18} />}
                    type="button"
                    onClick={openCreateUserModal}
                >
                    Novo usuário
                </Button>
            </div>

            <DataTable
                empty={isLoading ? 'Carregando usuários...' : error || 'Nenhum usuário encontrado.'}
                isEmpty={isLoading || Boolean(error) || users.length === 0}
                tableClassName="users-table"
                wrapperClassName="users-table-card"
            >
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

                            <td>{formatDate(user.createdAt)}</td>

                            <td>
                                <div className="users-actions">
                                    <IconButton
                                        label="Editar usuário"
                                        onClick={() => openEditUserModal(user)}
                                    >
                                        <Pencil size={18} />
                                    </IconButton>

                                    <IconButton
                                        label="Inativar usuário"
                                        onClick={() => handleDeleteUser(user.id)}
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
                key={selectedUser?.id ?? 'new'}
                isOpen={isModalOpen}
                onClose={closeUserModal}
                onSaveUser={handleSaveUser}
                user={selectedUser}
            />
        </div>
    );
}
