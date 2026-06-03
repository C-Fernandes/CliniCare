import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Languages, Moon, Sun, UserRound } from 'lucide-react';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { useAuth } from '../../hooks/useAuth';
import { usePreferences } from '../../hooks/usePreferences';
import { getUnreadNotifications } from '../../services/notifications';

import './AppLayout.scss';

export function AppLayout() {
    const { user } = useAuth();
    const { language, setLanguage, t, theme, toggleTheme } = usePreferences();
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    const loadUnreadNotifications = useCallback(async () => {
        try {
            const response = await getUnreadNotifications({ page: 0, size: 1 });
            setUnreadNotifications(response.totalElements);
        } catch {
            setUnreadNotifications(0);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(loadUnreadNotifications, 0);

        return () => window.clearTimeout(timeoutId);
    }, [loadUnreadNotifications, location.pathname]);

    useEffect(() => {
        window.addEventListener('focus', loadUnreadNotifications);
        window.addEventListener('clinicare:notifications-updated', loadUnreadNotifications);

        return () => {
            window.removeEventListener('focus', loadUnreadNotifications);
            window.removeEventListener('clinicare:notifications-updated', loadUnreadNotifications);
        };
    }, [loadUnreadNotifications]);

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="app-content">
                <header className="topbar">
                    <h1>{t('common.dashboard')}</h1>

                    <div className="topbar__actions">
                        <div className="topbar__preferences">
                            <button
                                aria-label={theme === 'light' ? t('theme.dark') : t('theme.light')}
                                className="topbar__icon-button"
                                onClick={toggleTheme}
                                title={theme === 'light' ? t('theme.dark') : t('theme.light')}
                                type="button"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>

                            <label className="topbar__language">
                                <Languages size={16} />
                                <select
                                    aria-label="Language"
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value === 'en' ? 'en' : 'pt')}
                                >
                                    <option value="pt">PT</option>
                                    <option value="en">EN</option>
                                </select>
                            </label>
                        </div>

                        <button
                            className="topbar__icon-button"
                            onClick={() => navigate('/notifications')}
                            aria-label={t('nav.notifications')}
                            type="button"
                        >
                            <Bell size={20} />
                            {unreadNotifications > 0 && (
                                <span className="topbar__notification-badge">
                                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                                </span>
                            )}
                        </button>

                        <div className="topbar__user">
                            <div className="topbar__avatar">
                                <UserRound size={18} />
                            </div>

                            <div>
                                <strong>{user?.name ?? t('common.professional')}</strong>
                                <span>{user?.role === 'ADMIN' ? t('common.admin') : t('common.professional')}</span>
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
