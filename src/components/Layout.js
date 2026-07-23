import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-grid">
      <aside className="sidebar">
        <div className="logo">NexaVerse</div>
        <nav className="sidebar-nav">
          <NavLink to="/">Overview</NavLink>
          <NavLink to="/alunos">Alunos</NavLink>
          <NavLink to="/personals">Personal Trainers</NavLink>
          <NavLink to="/planos">Planos</NavLink>
          <NavLink to="/pagamentos">Pagamentos</NavLink>
          <NavLink to="/avaliacoes">Avaliações</NavLink>
          <NavLink to="/treinos">Treinos</NavLink>
          <NavLink to="/alterar-senha">Alterar Senha</NavLink>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-button" onClick={logout}>Log out</button>
        </div>
      </aside>
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p>Bem-vindo(a), {user?.nome}</p>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
