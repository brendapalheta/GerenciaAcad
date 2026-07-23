import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function PersonalsPage() {
  const { user } = useAuth();
  const { data, addEntity, updateEntity, deleteEntity, nextId } = useData();
  const [form, setForm] = useState({ nome: '', email: '' });
  const [editing, setEditing] = useState(null);

  if (user.perfil !== 'Administrador') {
    return (
      <div className="card">
        <h2>Acesso negado</h2>
        <p>Somente administradores podem ver esta página.</p>
      </div>
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const entry = {
      id: editing ? editing.id : nextId('personals'),
      nome: form.nome,
      email: form.email
    };

    if (editing) {
      updateEntity('personals', entry);
    } else {
      addEntity('personals', entry);
    }
    setEditing(null);
    setForm({ nome: '', email: '' });
  };

  const editar = (personal) => {
    setEditing(personal);
    setForm({ nome: personal.nome, email: personal.email });
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Personal Trainers</h2>
          <p>Cadastre e gerencie os profissionais do time.</p>
        </div>
        <button className="primary-button" onClick={() => { setEditing(null); setForm({ nome: '', email: '' }); }}>Novo Pessoa</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.personals.map((personal) => (
              <tr key={personal.id}>
                <td>{personal.nome}</td>
                <td>{personal.email}</td>
                <td>
                  <button className="ghost-button" onClick={() => editar(personal)}>Editar</button>
                  <button className="danger-button" onClick={() => deleteEntity('personals', personal.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card form-card">
        <h3>{editing ? 'Editar Personal Trainer' : 'Novo Personal Trainer'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </label>
          <label>
            E-mail
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <div className="form-actions">
            <button type="submit" className="primary-button">Salvar</button>
            <button type="button" className="ghost-button" onClick={() => { setEditing(null); setForm({ nome: '', email: '' }); }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
