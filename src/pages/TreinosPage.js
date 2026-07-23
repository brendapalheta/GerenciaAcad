import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function TreinosPage() {
  const { user } = useAuth();
  const { data, addEntity, updateEntity, deleteEntity, nextId, generateTreinoPersonalizado } = useData();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ alunoId: '', objetivo: '', nivel: '', frequenciaSemanal: 3, restricoes: '', detalhes: '' });

  const treinosVisiveis = useMemo(() => {
    if (user.perfil === 'Aluno') {
      const aluno = data.alunos.find((alunoItem) => alunoItem.email === user.email);
      return data.treinos.filter((treino) => treino.alunoId === aluno?.id);
    }
    if (user.perfil === 'Personal Trainer') {
      return data.treinos.filter((treino) => treino.personalId === user.id);
    }
    return data.treinos;
  }, [data.treinos, data.alunos, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const treinoData = {
      id: editing ? editing.id : nextId('treinos'),
      alunoId: Number(form.alunoId),
      personalId: user.id,
      objetivo: form.objetivo,
      nivel: form.nivel,
      frequenciaSemanal: Number(form.frequenciaSemanal),
      restricoes: form.restricoes,
      detalhes: form.detalhes
    };
    if (editing) {
      updateEntity('treinos', treinoData);
    } else {
      addEntity('treinos', treinoData);
    }
    setEditing(null);
    setForm({ alunoId: '', objetivo: '', nivel: '', frequenciaSemanal: 3, restricoes: '', detalhes: '' });
  };

  const editar = (treino) => {
    setEditing(treino);
    setForm({
      alunoId: treino.alunoId.toString(),
      objetivo: treino.objetivo,
      nivel: treino.nivel,
      frequenciaSemanal: treino.frequenciaSemanal,
      restricoes: treino.restricoes,
      detalhes: treino.detalhes
    });
  };

  const gerarPersonalizado = () => {
    const aluno = data.alunos.find((alunoItem) => alunoItem.id === Number(form.alunoId));
    if (!aluno) return;
    const detalhes = generateTreinoPersonalizado(aluno, form);
    setForm((current) => ({ ...current, detalhes }));
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Treinos</h2>
          <p>Gerencie fichas de treino e visualize o histórico dos alunos.</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Objetivo</th>
              <th>Nível</th>
              <th>Frequência</th>
              <th>Personal</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {treinosVisiveis.map((treino) => {
              const aluno = data.alunos.find((a) => a.id === treino.alunoId);
              const personal = data.personals.find((p) => p.id === treino.personalId);
              return (
                <tr key={treino.id}>
                  <td>{aluno?.nome || '—'}</td>
                  <td>{treino.objetivo}</td>
                  <td>{treino.nivel}</td>
                  <td>{treino.frequenciaSemanal}x / semana</td>
                  <td>{personal?.nome || '—'}</td>
                  <td>
                    {user.perfil === 'Personal Trainer' && (
                      <>
                        <button className="ghost-button" onClick={() => editar(treino)}>Editar</button>
                        <button className="danger-button" onClick={() => deleteEntity('treinos', treino.id)}>Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {user.perfil === 'Personal Trainer' && (
        <div className="card form-card">
          <h3>{editing ? 'Editar Treino' : 'Nova Ficha de Treino'}</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Aluno
              <select required value={form.alunoId} onChange={(e) => setForm({ ...form, alunoId: e.target.value })}>
                <option value="">Selecione</option>
                {data.alunos
                  .filter((aluno) => aluno.personalId === user.id)
                  .map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                  ))}
              </select>
            </label>
            <div className="grid-2">
              <label>
                Objetivo
                <input required value={form.objetivo} onChange={(e) => setForm({ ...form, objetivo: e.target.value })} />
              </label>
              <label>
                Nível
                <input required value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Frequência semanal
                <input required type="number" min="1" max="7" value={form.frequenciaSemanal} onChange={(e) => setForm({ ...form, frequenciaSemanal: e.target.value })} />
              </label>
              <label>
                Restrições
                <input value={form.restricoes} onChange={(e) => setForm({ ...form, restricoes: e.target.value })} />
              </label>
            </div>
            <label>
              Detalhes do treino
              <textarea required value={form.detalhes} onChange={(e) => setForm({ ...form, detalhes: e.target.value })} />
            </label>
            <div className="form-actions">
              <button type="button" className="secondary-button" onClick={gerarPersonalizado}>Gerar Treino Personalizado</button>
              <button type="submit" className="primary-button">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
