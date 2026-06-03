import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import './Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getApiError } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesControls } from '../../components/PreferencesControls/PreferencesControls';

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();
    const { t } = usePreferences();

    const [email, setEmail] = useState('admin@clinicare.local');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError('');
            await login({ email, password });
            navigate('/dashboard');
        } catch (requestError) {
            const message = getApiError(requestError, t('auth.loginError'));
            setError(message);
            showToast({ message, type: 'error' });
        }
    }

    return (
        <main className="login-page">
            <PreferencesControls />
            <section className="login-container">
                <div className="login-brand">
                    <div className="login-brand__icon">
                        <Stethoscope size={32} />
                    </div>

                    <h1>CliniCare</h1>
                    <p>{t('auth.tagline')}</p>
                </div>

                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>{t('auth.login')}</h2>
                        <p>{t('auth.loginSubtitle')}</p>
                    </div>

                    <FormField
                        htmlFor="email"
                        label={t('auth.email')}
                        controlProps={{
                            onChange: (event) => setEmail(event.target.value),
                            placeholder: t('auth.placeholderEmail'),
                            type: 'email',
                            value: email,
                        }}
                    />

                    <FormField
                        htmlFor="password"
                        label={t('auth.password')}
                        controlProps={{
                            onChange: (event) => setPassword(event.target.value),
                            placeholder: t('auth.placeholderPassword'),
                            type: 'password',
                            value: password,
                        }}
                    />

                    <Button className="login-button" fullWidth type="submit">
                        {t('auth.login')}
                    </Button>

                    {error && <p className="login-error">{error}</p>}

                    <div className="login-links">
                        <Link to="/forgot-password">{t('auth.forgotPassword')}</Link>
                        <span>{t('auth.noAccount')} <Link to="/register">{t('actions.createAccount')}</Link></span>
                    </div>
                </Card>
            </section>
        </main>
    );
}
