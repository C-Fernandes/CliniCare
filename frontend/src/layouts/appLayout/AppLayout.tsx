import { Outlet } from 'react-router-dom';
import { Bell, UserRound } from 'lucide-react';

import { Sidebar } from '../../components/Sidebar/Sidebar';

import './AppLayout.scss';

export function AppLayout() {
    const user = JSON.parse(localStorage.getItem('clinicare:user') ?? '{}');

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-content">
                <header className="topbar">
                    <h1>Dashboard</h1>

                    <div className="topbar__actions">
                        <button className="topbar__notification">
                            <Bell size={20} />
                            <span>3</span>
                        </button>

                        <div className="topbar__user">
                            <div className="topbar__avatar">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <strong>{user.name ?? 'Usuário'}</strong>
                                <span>{user.role === 'ADMIN' ? 'Administrador' : 'Profissional'}</span>
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
