import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import '../login/Login.scss';
import { Button, Card, FormField } from '../../components/UI';
import { getApiError } from '../../services/api';
import { requestPasswordReset } from '../../services/auth';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setError('');
            await requestPasswordReset(email);
            setMessage('Se houver uma conta vinculada, enviaremos as instruções.');
        } catch (requestError) {
            setError(getApiError(requestError, 'Não foi possível processar a solicitação.'));
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
                        <h2>Esqueci minha senha</h2>
                        <p>Informe seu e-mail para receber as instruções</p>
                    </div>
                    <FormField htmlFor="email" label="Email" controlProps={{ value: email, onChange: (event) => setEmail(event.target.value), type: 'email', required: true }} />
                    <Button className="login-button" fullWidth type="submit">Enviar instruções</Button>
                    {message && <p className="login-success">{message}</p>}
                    {error && <p className="login-error">{error}</p>}
                    <div className="login-links"><Link to="/login">Voltar para o login</Link></div>
                </Card>
            </section>
        </main>
    );
}
