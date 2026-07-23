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
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Overview</NavLink>
          <NavLink to="/alunos" className={({ isActive }) => (isActive ? 'active' : '')}>Alunos</NavLink>
          {user?.perfil === 'Administrador' && (
            <NavLink to="/personals" className={({ isActive }) => (isActive ? 'active' : '')}>Personal Trainers</NavLink>
          )}
          {user?.perfil === 'Administrador' && (
            <NavLink to="/planos" className={({ isActive }) => (isActive ? 'active' : '')}>Planos</NavLink>
          )}
          <NavLink to="/pagamentos" className={({ isActive }) => (isActive ? 'active' : '')}>Pagamentos</NavLink>
          <NavLink to="/avaliacoes" className={({ isActive }) => (isActive ? 'active' : '')}>Avaliações</NavLink>
          <NavLink to="/treinos" className={({ isActive }) => (isActive ? 'active' : '')}>Treinos</NavLink>
          <NavLink to="/alterar-senha" className={({ isActive }) => (isActive ? 'active' : '')}>Alterar Senha</NavLink>
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
