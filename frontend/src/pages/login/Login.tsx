import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import './Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { getApiError } from '../../services/api';
import { useToast } from '../../hooks/useToast';

export function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

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
            const message = getApiError(requestError, 'E-mail ou senha inválidos.');
            setError(message);
            showToast({ message, type: 'error' });
        }
    }

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-brand">
                    <div className="login-brand__icon">
                        <Stethoscope size={32} />
                    </div>

                    <h1>CliniCare</h1>
                    <p>Acompanhamento clínico inteligente de pacientes</p>
                </div>

                <Card as="form" className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>Entrar</h2>
                        <p>Acesse sua conta para continuar</p>
                    </div>

                    <FormField
                        htmlFor="email"
                        label="Email"
                        controlProps={{
                            onChange: (event) => setEmail(event.target.value),
                            placeholder: 'Digite seu email',
                            type: 'email',
                            value: email,
                        }}
                    />

                    <FormField
                        htmlFor="password"
                        label="Senha"
                        controlProps={{
                            onChange: (event) => setPassword(event.target.value),
                            placeholder: 'Digite sua senha',
                            type: 'password',
                            value: password,
                        }}
                    />

                    <Button className="login-button" fullWidth type="submit">
                        Entrar
                    </Button>

                    {error && <p className="login-error">{error}</p>}

                    <div className="login-links">
                        <Link to="/forgot-password">Esqueci minha senha</Link>
                        <span>Não possui uma conta? <Link to="/register">Criar conta</Link></span>
                    </div>
                </Card>
            </section>
        </main>
    );
}
