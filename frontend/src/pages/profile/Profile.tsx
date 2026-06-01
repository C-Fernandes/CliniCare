import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Profile.scss';
import { Badge, Button, Card } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';

const roleLabels = {
    ADMIN: 'Administrador',
    PROFESSIONAL: 'Profissional',
};

export function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const initials = (user?.name ?? 'Usuário')
        .split(' ')
        .slice(0, 2)
        .map((part: string) => part[0])
        .join('')
        .toUpperCase();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>

                    <div>
                        <h2>{user?.name}</h2>
                        <Badge className="profile-role-badge" tone="primary">
                            {user ? roleLabels[user.role] : ''}
                        </Badge>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-info__item">
                        <span>Email</span>
                        <strong>{user?.email}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Perfil</span>
                        <strong>{user ? roleLabels[user.role] : ''}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Status</span>
                        <strong>Ativo</strong>
                    </div>
                </div>

                <div className="profile-footer">
                    <Button
                        icon={<LogOut size={18} />}
                        onClick={handleLogout}
                        type="button"
                        variant="danger"
                    >
                        Sair
                    </Button>
                </div>
            </Card>
        </div>
    );
}
