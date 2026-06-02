import { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Power, X } from 'lucide-react';


import './Users.scss';
import { UserModal } from '../../components/UserModal/UserModal';
import { Badge, Button, DataTable, IconButton, Pagination } from '../../components/UI';
import {
    createUser,
    deleteUser,
    getUsers,
    approveUser,
    rejectUser,
    updateUser,
} from '../../services/users';
import type { User, UserApprovalStatus, UserFormData, UserRole } from '../../types/user';
import { getApiError } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';

const roleLabels: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    PROFESSIONAL: 'Profissional',
};

const roleTones: Record<UserRole, 'primary' | 'cyan'> = {
    ADMIN: 'primary',
    PROFESSIONAL: 'cyan',
};

const approvalLabels: Record<UserApprovalStatus, string> = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    REJECTED: 'Recusado',
};

const approvalTones: Record<UserApprovalStatus, 'warning' | 'success' | 'danger'> = {
    PENDING: 'warning',
    APPROVED: 'success',
    REJECTED: 'danger',
};

export function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { showToast } = useToast();

    useEffect(() => {
        async function loadUsers() {
            try {
                setIsLoading(true);
                setError('');
                const response = await getUsers({ page });
                setUsers(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
            } catch {
                const message = 'Não foi possível carregar os usuários.';
                setError(message);
                showToast({ message, type: 'error' });
            } finally {
                setIsLoading(false);
            }
        }

        loadUsers();
    }, [page, showToast]);

    async function handleSaveUser(data: UserFormData) {
        try {
            if (selectedUser) {
                const updatedUser = await updateUser(selectedUser.id, data);
                setUsers((currentUsers) =>
                    currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user)
                );
                showToast({ message: 'Usuário atualizado com sucesso.', type: 'success' });
                return;
            }

            const newUser = await createUser(data);
            setUsers((currentUsers) => [...currentUsers, newUser]);
            showToast({ message: 'Usuário criado com sucesso.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, 'Não foi possível salvar o usuário.'),
                type: 'error',
            });
            throw requestError;
        }
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
        try {
            await deleteUser(id);
            setUsers((currentUsers) => currentUsers.filter((user) => user.id !== id));
            showToast({ message: 'Usuário inativado com sucesso.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, 'Não foi possível inativar o usuário.'),
                type: 'error',
            });
        }
    }

    async function handleApproval(id: number, approve: boolean) {
        try {
            const updatedUser = approve ? await approveUser(id) : await rejectUser(id);
            setUsers((currentUsers) =>
                currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user)
            );
            showToast({ message: approve ? 'Usuário aprovado com sucesso.' : 'Usuário recusado com sucesso.', type: 'success' });
        } catch (requestError) {
            showToast({
                message: getApiError(requestError, approve ? 'Não foi possível aprovar o usuário.' : 'Não foi possível recusar o usuário.'),
                type: 'error',
            });
        }
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
                        <th>Aprovação</th>
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
                                <Badge tone={approvalTones[user.approvalStatus]}>
                                    {approvalLabels[user.approvalStatus]}
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
                                    {user.approvalStatus === 'PENDING' && (
                                        <>
                                            <IconButton label="Aprovar usuário" onClick={() => handleApproval(user.id, true)}>
                                                <Check size={18} />
                                            </IconButton>
                                            <IconButton label="Recusar usuário" onClick={() => handleApproval(user.id, false)}>
                                                <X size={18} />
                                            </IconButton>
                                        </>
                                    )}
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

            <Pagination page={page} totalPages={totalPages} totalElements={totalElements} onPageChange={setPage} />

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
