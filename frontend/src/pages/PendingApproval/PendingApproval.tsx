import { Clock, LogIn, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../Login/Login.scss';
import './PendingApproval.scss';
import { Button, Card } from '../../components/UI';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesControls } from '../../components/PreferencesControls/PreferencesControls';

interface PendingApprovalState {
    email?: string;
}

export function PendingApproval() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as PendingApprovalState | null;
    const { t } = usePreferences();

    return (
        <main className="login-page">
            <PreferencesControls />
            <section className="login-container pending-approval">
                <div className="login-brand">
                    <div className="login-brand__icon"><ShieldCheck size={32} /></div>
                    <h1>CliniCare</h1>
                    <p>{t('pendingApproval.accountReview')}</p>
                </div>

                <Card className="login-card pending-approval-card">
                    <div className="pending-approval-card__icon">
                        <Clock size={32} />
                    </div>

                    <div className="login-card__header">
                        <h2>{t('pendingApproval.approvalTitle')}</h2>
                        <p>
                            {t('pendingApproval.description')}
                        </p>
                    </div>

                    {state?.email && (
                        <p className="pending-approval-card__email">
                            {t('pendingApproval.emailSentTo')} <strong>{state.email}</strong>.
                        </p>
                    )}

                    <div className="pending-approval-card__notice">
                        <ShieldCheck size={20} />
                        <p>
                            {t('pendingApproval.nextSteps')}
                        </p>
                    </div>

                    <Button
                        className="login-button"
                        fullWidth
                        icon={<LogIn size={18} />}
                        onClick={() => navigate('/login')}
                    >
                        {t('actions.back')}
                    </Button>
                </Card>
            </section>
        </main>
    );
}
