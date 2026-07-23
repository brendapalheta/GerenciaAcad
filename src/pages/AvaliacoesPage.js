import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function AvaliacoesPage() {
  const { user } = useAuth();
  const { data, addEntity, nextId } = useData();
  const [form, setForm] = useState({ alunoId: '', data: '', peso: '', altura: '', imc: '', percentualGordura: '', massaMuscular: '', circunferencias: '' });

  const avaliacoesVisiveis = useMemo(() => {
    if (user.perfil === 'Aluno') {
      const aluno = data.alunos.find((alunoItem) => alunoItem.email === user.email);
      return data.avaliacoes.filter((avaliacao) => avaliacao.alunoId === aluno?.id);
    }
    if (user.perfil === 'Personal Trainer') {
      const ids = data.alunos.filter((alunoItem) => alunoItem.personalId === user.id).map((a) => a.id);
      return data.avaliacoes.filter((avaliacao) => ids.includes(avaliacao.alunoId));
    }
    return data.avaliacoes;
  }, [data.avaliacoes, data.alunos, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addEntity('avaliacoes', {
      id: nextId('avaliacoes'),
      alunoId: Number(form.alunoId),
      data: form.data,
      peso: Number(form.peso),
      altura: Number(form.altura),
      imc: Number(form.imc),
      percentualGordura: Number(form.percentualGordura),
      massaMuscular: Number(form.massaMuscular),
      circunferencias: form.circunferencias
    });
    setForm({ alunoId: '', data: '', peso: '', altura: '', imc: '', percentualGordura: '', massaMuscular: '', circunferencias: '' });
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Avaliações Físicas</h2>
          <p>Consulte o histórico e cadastre novas avaliações.</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Data</th>
              <th>Peso</th>
              <th>IMC</th>
              <th>% Gordura</th>
              <th>Massa</th>
              <th>Circunferências</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoesVisiveis.map((avaliacao) => {
              const aluno = data.alunos.find((a) => a.id === avaliacao.alunoId);
              return (
                <tr key={avaliacao.id}>
                  <td>{aluno?.nome || '—'}</td>
                  <td>{avaliacao.data}</td>
                  <td>{avaliacao.peso} kg</td>
                  <td>{avaliacao.imc}</td>
                  <td>{avaliacao.percentualGordura}%</td>
                  <td>{avaliacao.massaMuscular} kg</td>
                  <td>{avaliacao.circunferencias}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {user.perfil === 'Administrador' && (
        <div className="card form-card">
          <h3>Cadastrar Avaliação</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Aluno
              <select required value={form.alunoId} onChange={(e) => setForm({ ...form, alunoId: e.target.value })}>
                <option value="">Selecione</option>
                {data.alunos.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                ))}
              </select>
            </label>
            <div className="grid-2">
              <label>
                Data
                <input required type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
              </label>
              <label>
                Peso
                <input required type="number" step="0.1" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                Altura
                <input required type="number" step="0.01" value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} />
              </label>
              <label>
                IMC
                <input required type="number" step="0.1" value={form.imc} onChange={(e) => setForm({ ...form, imc: e.target.value })} />
              </label>
            </div>
            <div className="grid-2">
              <label>
                % Gordura
                <input required type="number" step="0.1" value={form.percentualGordura} onChange={(e) => setForm({ ...form, percentualGordura: e.target.value })} />
              </label>
              <label>
                Massa Muscular
                <input required type="number" step="0.1" value={form.massaMuscular} onChange={(e) => setForm({ ...form, massaMuscular: e.target.value })} />
              </label>
            </div>
            <label>
              Circunferências
              <textarea value={form.circunferencias} onChange={(e) => setForm({ ...form, circunferencias: e.target.value })} />
            </label>
            <button type="submit" className="primary-button">Cadastrar</button>
          </form>
        </div>
      )}
    </div>
  );
}
