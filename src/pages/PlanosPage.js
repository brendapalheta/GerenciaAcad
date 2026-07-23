import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function PlanosPage() {
  const { user } = useAuth();
  const { data, addEntity, updateEntity, deleteEntity, nextId } = useData();
  const [form, setForm] = useState({ nome: '', valor: '', duracao_meses: '', descricao: '' });
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
    const novoPlano = {
      id: editing ? editing.id : nextId('planos'),
      nome: form.nome,
      valor: Number(form.valor),
      duracao_meses: Number(form.duracao_meses),
      descricao: form.descricao
    };

    if (editing) {
      updateEntity('planos', novoPlano);
    } else {
      addEntity('planos', novoPlano);
    }
    setEditing(null);
    setForm({ nome: '', valor: '', duracao_meses: '', descricao: '' });
  };

  const editar = (plano) => {
    setEditing(plano);
    setForm({ nome: plano.nome, valor: plano.valor.toString(), duracao_meses: plano.duracao_meses.toString(), descricao: plano.descricao });
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Planos</h2>
          <p>Gerencie as opções de planos oferecidas pela academia.</p>
        </div>
        <button className="primary-button" onClick={() => { setEditing(null); setForm({ nome: '', valor: '', duracao_meses: '', descricao: '' }); }}>Novo Plano</button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor</th>
              <th>Duração</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.planos.map((plano) => (
              <tr key={plano.id}>
                <td>{plano.nome}</td>
                <td>R$ {plano.valor.toFixed(2)}</td>
                <td>{plano.duracao_meses} mês(es)</td>
                <td>{plano.descricao}</td>
                <td>
                  <button className="ghost-button" onClick={() => editar(plano)}>Editar</button>
                  <button className="danger-button" onClick={() => deleteEntity('planos', plano.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card form-card">
        <h3>{editing ? 'Editar Plano' : 'Novo Plano'}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </label>
          <div className="grid-2">
            <label>
              Valor
              <input required type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
            </label>
            <label>
              Duração (meses)
              <input required type="number" value={form.duracao_meses} onChange={(e) => setForm({ ...form, duracao_meses: e.target.value })} />
            </label>
          </div>
          <label>
            Descrição
            <textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </label>
          <div className="form-actions">
            <button type="submit" className="primary-button">Salvar</button>
            <button type="button" className="ghost-button" onClick={() => { setEditing(null); setForm({ nome: '', valor: '', duracao_meses: '', descricao: '' }); }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
