import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { requestPasswordReset } from '../../services/auth';
import { useToast } from '../../hooks/useToast';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesControls } from '../../components/PreferencesControls/PreferencesControls';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { showToast } = useToast();
    const { t } = usePreferences();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setError('');
            await requestPasswordReset(email);
            setMessage(t('auth.forgotPasswordResult'));
            showToast({ message: t('auth.forgotPasswordResult'), type: 'success' });
        } catch (requestError) {
            const apiError = getApiError(requestError, t('auth.processError'));
            setError(apiError);
            showToast({ message: apiError, type: 'error' });
        }
    }

    return (
        <main className="login-page">
            <PreferencesControls />
            <section className="login-container">
                <div className="login-brand">
                    <div className="login-brand__icon"><Stethoscope size={32} /></div>
                    <h1>CliniCare</h1>
                </div>
                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>{t('auth.forgotPassword')}</h2>
                        <p>{t('auth.emailInstructions')}</p>
                    </div>
                    <FormField htmlFor="email" label={t('auth.email')} controlProps={{ value: email, onChange: (event) => setEmail(event.target.value), type: 'email', required: true }} />
                    <Button className="login-button" fullWidth type="submit">{t('actions.sendInstructions')}</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><Link to="/login">{t('actions.back')}</Link></div>
                </Card>
            </section>
        </main>
    );
}
