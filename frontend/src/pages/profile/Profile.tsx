import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Profile.scss';

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
            <section className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">{user.initials}</div>

                    <div>
                        <h2>{user.name}</h2>
                        <span className="profile-role-badge">{user.role}</span>
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
                    <button type="button" onClick={handleLogout}>
                        <LogOut size={18} />
                        Sair
                    </button>
                </div>
            </section>
        </div>
    );
}