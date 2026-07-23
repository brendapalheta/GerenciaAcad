import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function AlunosPage() {
  const { user } = useAuth();
  const { data, addEntity, updateEntity, deleteEntity, nextId } = useData();
  const [termo, setTermo] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '', dataNascimento: '', planoId: '', personalId: '', statusMensalidade: 'Em dia', vencimento: '' });

  const alunosVisiveis = useMemo(() => {
    const base = user.perfil === 'Personal Trainer'
      ? data.alunos.filter((aluno) => aluno.personalId === user.id)
      : user.perfil === 'Aluno'
      ? data.alunos.filter((aluno) => aluno.email === user.email)
      : data.alunos;

    if (!termo) return base;

    return base.filter((aluno) =>
      aluno.nome.toLowerCase().includes(termo.toLowerCase()) || aluno.cpf.includes(termo)
    );
  }, [data.alunos, termo, user]);

  const selecionarAluno = (aluno) => {
    setAlunoSelecionado(aluno);
    setForm({
      nome: aluno.nome,
      cpf: aluno.cpf,
      telefone: aluno.telefone,
      email: aluno.email,
      dataNascimento: aluno.dataNascimento,
      planoId: aluno.planoId || '',
      personalId: aluno.personalId || '',
      statusMensalidade: aluno.statusMensalidade,
      vencimento: aluno.vencimento || ''
    });
  };

  const limparFormulario = () => {
    setAlunoSelecionado(null);
    setForm({ nome: '', cpf: '', telefone: '', email: '', dataNascimento: '', planoId: '', personalId: '', statusMensalidade: 'Em dia', vencimento: '' });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const alunoData = {
      id: alunoSelecionado ? alunoSelecionado.id : nextId('alunos'),
      nome: form.nome,
      cpf: form.cpf,
      telefone: form.telefone,
      email: form.email,
      dataNascimento: form.dataNascimento,
      planoId: Number(form.planoId) || null,
      personalId: Number(form.personalId) || null,
      statusMensalidade: form.statusMensalidade,
      vencimento: form.vencimento
    };

    if (alunoSelecionado) {
      updateEntity('alunos', alunoData);
    } else {
      addEntity('alunos', alunoData);
    }
    limparFormulario();
  };

  const excluir = (id) => {
    if (window.confirm('Deseja excluir este aluno?')) {
      deleteEntity('alunos', id);
    }
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Alunos</h2>
          <p>Visualize e gerencie os alunos cadastrados.</p>
        </div>
        {user.perfil === 'Administrador' && (
          <button className="primary-button" onClick={limparFormulario}>Novo Aluno</button>
        )}
      </div>

      <div className="card">
        <label>Buscar por nome ou CPF</label>
        <input value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Digite nome ou CPF" />
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Plano</th>
              <th>Personal</th>
              <th>Status</th>
              <th>Vencimento</th>
              {user.perfil === 'Administrador' && <th>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {alunosVisiveis.map((aluno) => {
              const plano = data.planos.find((p) => p.id === aluno.planoId);
              const personal = data.personals.find((p) => p.id === aluno.personalId);
              return (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.cpf}</td>
                  <td>{plano?.nome || '—'}</td>
                  <td>{personal?.nome || '—'}</td>
                  <td>{aluno.statusMensalidade}</td>
                  <td>{aluno.vencimento || '—'}</td>
                  {user.perfil === 'Administrador' && (
                    <td>
                      <button className="ghost-button" onClick={() => selecionarAluno(aluno)}>Editar</button>
                      <button className="danger-button" onClick={() => excluir(aluno.id)}>Excluir</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {user.perfil === 'Administrador' && (
        <div className="card form-card">
          <h3>{alunoSelecionado ? 'Editar Aluno' : 'Novo Aluno'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <label>
                Nome
                <input required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </label>
              <label>
                CPF
                <input required value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Telefone
                <input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              </label>
              <label>
                E-mail
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Data de nascimento
                <input type="date" value={form.dataNascimento} onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })} />
              </label>
              <label>
                Vencimento
                <input type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Plano
                <select value={form.planoId} onChange={(e) => setForm({ ...form, planoId: e.target.value })}>
                  <option value="">Selecione</option>
                  {data.planos.map((plano) => (
                    <option key={plano.id} value={plano.id}>{plano.nome}</option>
                  ))}
                </select>
              </label>
              <label>
                Personal Trainer
                <select value={form.personalId} onChange={(e) => setForm({ ...form, personalId: e.target.value })}>
                  <option value="">Selecione</option>
                  {data.personals.map((personal) => (
                    <option key={personal.id} value={personal.id}>{personal.nome}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid-2">
              <label>
                Status da mensalidade
                <select value={form.statusMensalidade} onChange={(e) => setForm({ ...form, statusMensalidade: e.target.value })}>
                  <option value="Em dia">Em dia</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">Salvar</button>
              <button type="button" className="ghost-button" onClick={limparFormulario}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
