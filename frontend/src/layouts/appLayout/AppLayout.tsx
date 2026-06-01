import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, UserRound } from 'lucide-react';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';

import './AppLayout.scss';

export function AppLayout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-content">
                <header className="topbar">
                    <h1>Dashboard</h1>

                    <div className="topbar__actions">
                        <button
                            className="topbar__notification"
                            onClick={() => navigate('/notifications')}
                            type="button"
                        >
                            <Bell size={20} />
                        </button>

                        <div className="topbar__user">
                            <div className="topbar__avatar">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <strong>{user?.name ?? 'Usuário'}</strong>
                                <span>{user?.role === 'ADMIN' ? 'Administrador' : 'Profissional'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
