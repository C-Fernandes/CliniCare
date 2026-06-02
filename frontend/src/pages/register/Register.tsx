import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { register } from '../../services/auth';
import { useToast } from '../../hooks/useToast';

export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { showToast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmation) {
            setError('As senhas não coincidem.');
            showToast({ message: 'As senhas não coincidem.', type: 'error' });
            return;
        }

        try {
            await register({ name, email, password });
            setMessage('Conta criada. Aguarde a aprovação do administrador.');
            showToast({ message: 'Conta criada e enviada para aprovação.', type: 'success' });
            navigate('/pending-approval', { replace: true, state: { email } });
        } catch (requestError) {
            const apiError = getApiError(requestError, 'Não foi possível criar sua conta.');
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
                    <p>Crie sua conta profissional</p>
                </div>
                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>Criar conta</h2>
                        <p>Comece a acompanhar seus pacientes em minutos</p>
                    </div>
                    <FormField htmlFor="name" label="Nome completo" controlProps={{ value: name, onChange: (event) => setName(event.target.value), required: true }} />
                    <FormField htmlFor="email" label="Email profissional" controlProps={{ value: email, onChange: (event) => setEmail(event.target.value), type: 'email', required: true }} />
                    <FormField htmlFor="password" label="Senha" controlProps={{ value: password, onChange: (event) => setPassword(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <FormField htmlFor="confirmation" label="Confirmar senha" controlProps={{ value: confirmation, onChange: (event) => setConfirmation(event.target.value), type: 'password', minLength: 8, required: true }} />
                    <Button className="login-button" fullWidth type="submit">Criar conta</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><span>Já possui uma conta? <Link to="/login">Entrar</Link></span></div>
                </Card>
            </section>
        </main>
    );
}
