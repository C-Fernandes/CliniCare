import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../Login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { resetPassword } from '../../services/auth';
import { useToast } from '../../hooks/useToast';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesControls } from '../../components/PreferencesControls/PreferencesControls';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = searchParams.get('token') ?? '';
    const { showToast } = useToast();
    const { t } = usePreferences();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (password !== confirmation) {
            setError(t('auth.passwordMismatch'));
            showToast({ message: t('auth.passwordMismatch'), type: 'error' });
            return;
        }

        try {
            await resetPassword(token, password);
            setMessage(t('auth.resetPasswordSuccess'));
            showToast({ message: t('auth.resetPasswordToast'), type: 'success' });
        } catch (requestError) {
            const apiError = getApiError(requestError, t('auth.resetPasswordError'));
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
                        <h2>{t('actions.resetPassword')}</h2>
                        <p>{t('auth.resetPasswordMessage')}</p>
                    </div>
                    <FormField htmlFor="password" label={t('auth.newPassword')} controlProps={{ value: password, onChange: (event) => setPassword(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <FormField htmlFor="confirmation" label={t('auth.confirmNewPassword')} controlProps={{ value: confirmation, onChange: (event) => setConfirmation(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <Button className="login-button" fullWidth type="submit" disabled={!token}>{t('actions.resetPassword')}</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><Link to="/login">{t('actions.back')}</Link></div>
                </Card>
            </section>
        </main>
    );
}
