import { Clock, LogIn, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../login/Login.scss';
import './PendingApproval.scss';
import { Button, Card } from '../../components/UI';

interface PendingApprovalState {
    email?: string;
}

export function PendingApproval() {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as PendingApprovalState | null;

    return (
        <main className="login-page">
            <section className="login-container pending-approval">
                <div className="login-brand">
                    <div className="login-brand__icon"><ShieldCheck size={32} /></div>
                    <h1>CliniCare</h1>
                    <p>Conta em análise</p>
                </div>

                <Card className="login-card pending-approval-card">
                    <div className="pending-approval-card__icon">
                        <Clock size={32} />
                    </div>

                    <div className="login-card__header">
                        <h2>Aguardando aprovação</h2>
                        <p>
                            Sua conta foi criada com sucesso e está aguardando aprovação de um administrador.
                        </p>
                    </div>

                    {state?.email && (
                        <p className="pending-approval-card__email">
                            Solicitação enviada para <strong>{state.email}</strong>.
                        </p>
                    )}

                    <div className="pending-approval-card__notice">
                        <ShieldCheck size={20} />
                        <p>
                            Assim que sua conta for aprovada, você receberá um e-mail e poderá acessar o sistema.
                        </p>
                    </div>

                    <Button
                        className="login-button"
                        fullWidth
                        icon={<LogIn size={18} />}
                        onClick={() => navigate('/login')}
                    >
                        Voltar para o login
                    </Button>
                </Card>
            </section>
        </main>
    );
}
