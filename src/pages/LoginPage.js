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
      <div className="login-card login-split">
        <div className="hero-panel hero-login-panel">
          <div className="hero-top">
            <span className="hero-brand">DesignAcademy</span>
            <div className="hero-cta">Explore Course List</div>
          </div>
          <div className="hero-copy">
            <h1>Unleash your<br />fitness potential</h1>
            <p>Controle sua academia com painel moderno, cadastros, planos, avaliações e treinos.</p>
          </div>
          <div className="hero-footer">
            <div>
              <strong>300+</strong>
              <span>Cursos</span>
            </div>
            <div>
              <strong>50+</strong>
              <span>Personal trainers</span>
            </div>
            <div>
              <strong>1000+</strong>
              <span>Horas de conteúdo</span>
            </div>
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Acesse seu painel</h2>
          <p>Use um dos perfis padrão ou seu usuário cadastrado.</p>
          {erro && <div className="alert danger">{erro}</div>}
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Senha
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </label>
          <button type="submit" className="primary-button">Entrar</button>
        </form>
      </div>
    </div>
  );
}
