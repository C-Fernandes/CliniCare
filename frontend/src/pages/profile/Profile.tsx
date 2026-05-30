import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Profile.scss';
import { Badge, Button, Card } from '../../components/UI';
import { formatDate } from '../../utils/formatters';

const roleLabels = {
    ADMIN: 'Administrador',
    PROFESSIONAL: 'Profissional',
};

export function Profile() {
    const navigate = useNavigate();

    const user = {
        name: 'Dra. Ana Costa',
        initials: 'DA',
        email: 'ana.costa@clinicare.com',
        role: 'ADMIN',
        status: 'Ativo',
        createdAt: '10/01/2025',
        ...JSON.parse(localStorage.getItem('clinicare:user') ?? '{}'),
    };

    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((part: string) => part[0])
        .join('')
        .toUpperCase();

    function handleLogout() {
        navigate('/login');
    }

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{initials}</div>

                    <div>
                        <h2>{user.name}</h2>
                        <Badge className="profile-role-badge" tone="primary">
                            {roleLabels[user.role as keyof typeof roleLabels] ?? user.role}
                        </Badge>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-info__item">
                        <span>Email</span>
                        <strong>{user.email}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Perfil</span>
                        <strong>{roleLabels[user.role as keyof typeof roleLabels] ?? user.role}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Data de criação</span>
                        <strong>{formatDate(user.createdAt)}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Status</span>
                        <strong>{user.status}</strong>
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
