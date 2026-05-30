import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Profile.scss';
import { Badge, Button, Card } from '../../components/UI';

export function Profile() {
    const navigate = useNavigate();

    const user = {
        name: 'Dra. Ana Costa',
        initials: 'DA',
        email: 'ana.costa@clinicare.com',
        role: 'Administrador',
        status: 'Ativo',
        createdAt: '10/01/2025',
    };

    function handleLogout() {
        navigate('/login');
    }

    return (
        <div className="profile-page">
            <Card className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{user.initials}</div>

                    <div>
                        <h2>{user.name}</h2>
                        <Badge className="profile-role-badge" tone="primary">
                            {user.role}
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
                        <strong>{user.role}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>Data de criação</span>
                        <strong>{user.createdAt}</strong>
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
