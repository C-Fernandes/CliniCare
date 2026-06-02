import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { resetPassword } from '../../services/auth';
import { useToast } from '../../hooks/useToast';

export function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const token = searchParams.get('token') ?? '';
    const { showToast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (password !== confirmation) {
            setError('As senhas não coincidem.');
            showToast({ message: 'As senhas não coincidem.', type: 'error' });
            return;
        }

        try {
            await resetPassword(token, password);
            setMessage('Senha redefinida. Você já pode entrar.');
            showToast({ message: 'Senha redefinida com sucesso.', type: 'success' });
        } catch (requestError) {
            const apiError = getApiError(requestError, 'Não foi possível redefinir a senha.');
            setError(apiError);
            showToast({ message: apiError, type: 'error' });
        }
    }

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-brand">
                    <div className="login-brand__icon"><Stethoscope size={32} /></div>
                    <h1>CliniCare</h1>
                </div>
                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>Redefinir senha</h2>
                        <p>Defina uma nova senha para sua conta</p>
                    </div>
                    <FormField htmlFor="password" label="Nova senha" controlProps={{ value: password, onChange: (event) => setPassword(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <FormField htmlFor="confirmation" label="Confirmar nova senha" controlProps={{ value: confirmation, onChange: (event) => setConfirmation(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <Button className="login-button" fullWidth type="submit" disabled={!token}>Redefinir senha</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><Link to="/login">Voltar para o login</Link></div>
                </Card>
            </section>
        </main>
    );
}
