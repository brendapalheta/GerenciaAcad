import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function PagamentosPage() {
  const { user } = useAuth();
  const { data, addEntity, nextId } = useData();
  const [form, setForm] = useState({ alunoId: '', valor: '', dataPagamento: '', descricao: '' });

  const pagamentosVisiveis = useMemo(() => {
    if (user.perfil === 'Aluno') {
      const aluno = data.alunos.find((alunoItem) => alunoItem.email === user.email);
      return data.pagamentos.filter((pagamento) => pagamento.alunoId === aluno?.id);
    }
    if (user.perfil === 'Personal Trainer') {
      const alunos = data.alunos.filter((alunoItem) => alunoItem.personalId === user.id).map((a) => a.id);
      return data.pagamentos.filter((pagamento) => alunos.includes(pagamento.alunoId));
    }
    return data.pagamentos;
  }, [data.pagamentos, data.alunos, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    addEntity('pagamentos', {
      id: nextId('pagamentos'),
      alunoId: Number(form.alunoId),
      valor: Number(form.valor),
      dataPagamento: form.dataPagamento,
      descricao: form.descricao
    });
    setForm({ alunoId: '', valor: '', dataPagamento: '', descricao: '' });
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h2>Pagamentos</h2>
          <p>Registre pagamentos e consulte o histórico financeiro.</p>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Aluno</th>
              <th>Valor</th>
              <th>Data</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {pagamentosVisiveis.map((pagamento) => {
              const aluno = data.alunos.find((a) => a.id === pagamento.alunoId);
              return (
                <tr key={pagamento.id}>
                  <td>{aluno?.nome || '—'}</td>
                  <td>R$ {pagamento.valor.toFixed(2)}</td>
                  <td>{pagamento.dataPagamento}</td>
                  <td>{pagamento.descricao}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {user.perfil === 'Administrador' && (
        <div className="card form-card">
          <h3>Registrar Pagamento</h3>
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
                Valor
                <input required type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
              </label>
              <label>
                Data
                <input required type="date" value={form.dataPagamento} onChange={(e) => setForm({ ...form, dataPagamento: e.target.value })} />
              </label>
            </div>
            <label>
              Descrição
              <input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </label>
            <button type="submit" className="primary-button">Registrar</button>
          </form>
        </div>
      )}
    </div>
  );
}
