import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';

import './Login.scss';

export function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('ana.costa@clinicare.com');
    const [password, setPassword] = useState('123456');

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Login mockado por enquanto
        navigate('/dashboard');
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

                <form className="login-card" onSubmit={handleSubmit}>
                    <div className="login-card__header">
                        <h2>Entrar</h2>
                        <p>Acesse sua conta para continuar</p>
                    </div>

                    <div className="login-form__group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            placeholder="Digite seu email"
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </div>

                    <div className="login-form__group">
                        <label htmlFor="password">Senha</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            placeholder="Digite sua senha"
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Entrar
                    </button>

                    <div className="login-demo">
                        <p>
                            Demo: <strong>ana.costa@clinicare.com</strong> (admin)
                        </p>
                        <p>
                            <strong>pedro.henrique@clinicare.com</strong> (profissional)
                        </p>
                    </div>
                </form>
            </section>
        </main>
    );
}