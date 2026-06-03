import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import './Profile.scss';
import { Badge, Button, Card } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { usePreferences } from '../../hooks/usePreferences';

export function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = usePreferences();

    const initials = (user?.name ?? t('common.professional'))
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
                            {user ? user.role === 'ADMIN' ? t('common.admin') : t('common.professional') : ''}
                        </Badge>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="profile-info__item">
                        <span>{t('common.email')}</span>
                        <strong>{user?.email}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>{t('users.profile')}</span>
                        <strong>{user ? user.role === 'ADMIN' ? t('common.admin') : t('common.professional') : ''}</strong>
                    </div>

                    <div className="profile-info__item">
                        <span>{t('common.status')}</span>
                        <strong>{t('users.active')}</strong>
                    </div>
                </div>

                <div className="profile-footer">
                    <Button
                        icon={<LogOut size={18} />}
                        onClick={handleLogout}
                        type="button"
                        variant="danger"
                    >
                        {t('actions.logout')}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
