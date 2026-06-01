import { NavLink, useNavigate } from 'react-router-dom';
import {
    Bell,
    CircleUserRound,
    LayoutDashboard,
    LogOut,
    Stethoscope,
    UserCog,
    Users,
} from 'lucide-react';

import './Sidebar.scss';
import { useAuth } from '../../hooks/useAuth';

export function Sidebar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <div className="sidebar__logo">
                    <Stethoscope size={24} />
                </div>

                <div>
                    <strong>CliniCare</strong>
                    <span>Acompanhamento clínico</span>
                </div>
            </div>

            <nav className="sidebar__nav">
                <NavLink to="/dashboard">
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                <NavLink to="/patients">
                    <Users size={18} />
                    Pacientes
                </NavLink>

                <NavLink to="/notifications">
                    <Bell size={18} />
                    Notificações
                </NavLink>

                {user?.role === 'ADMIN' && (
                    <NavLink to="/users">
                        <UserCog size={18} />
                        Usuários
                    </NavLink>
                )}

                <NavLink to="/profile">
                    <CircleUserRound size={18} />
                    Perfil
                </NavLink>
            </nav>

            <button className="sidebar__logout" onClick={handleLogout}>
                <LogOut size={18} />
                Sair
            </button>
        </aside>
    );
}
