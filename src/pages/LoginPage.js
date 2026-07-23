import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    const valido = login(email, senha);
    if (valido) {
      navigate('/');
    } else {
      setErro('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="hero-panel">
          <h1>NexaVerse</h1>
          <p>Gestão de academia com foco em aulas, alunos e treinos.</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Entrar</h2>
          {erro && <div className="alert danger">{erro}</div>}
          <label>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Senha</label>
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
