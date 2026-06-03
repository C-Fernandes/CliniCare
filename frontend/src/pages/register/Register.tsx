import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { register } from '../../services/auth';
import { useToast } from '../../hooks/useToast';
import { usePreferences } from '../../hooks/usePreferences';
import { PreferencesControls } from '../../components/PreferencesControls/PreferencesControls';

export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { showToast } = useToast();
    const { t } = usePreferences();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmation) {
            setError(t('auth.passwordMismatch'));
            showToast({ message: t('auth.passwordMismatch'), type: 'error' });
            return;
        }

        try {
            await register({ name, email, password });
            setMessage(t('auth.accountCreated'));
            showToast({ message: t('auth.accountSentForApproval'), type: 'success' });
            navigate('/pending-approval', { replace: true, state: { email } });
        } catch (requestError) {
            const apiError = getApiError(requestError, t('auth.registerError'));
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
                    <p>{t('auth.professionalAccount')}</p>
                </div>
                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>{t('actions.createAccount')}</h2>
                        <p>{t('auth.tagline')}</p>
                    </div>
                    <FormField htmlFor="name" label={t('common.fullName')} controlProps={{ value: name, onChange: (event) => setName(event.target.value), required: true }} />
                    <FormField htmlFor="email" label={t('auth.professionalEmail')} controlProps={{ value: email, onChange: (event) => setEmail(event.target.value), type: 'email', required: true }} />
                    <FormField htmlFor="password" label={t('auth.password')} controlProps={{ value: password, onChange: (event) => setPassword(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <FormField htmlFor="confirmation" label={t('auth.confirmPassword')} controlProps={{ value: confirmation, onChange: (event) => setConfirmation(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <Button className="login-button" fullWidth type="submit">{t('actions.createAccount')}</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><span>{t('auth.alreadyHasAccount')} <Link to="/login">{t('auth.login')}</Link></span></div>
                </Card>
            </section>
        </main>
    );
}
