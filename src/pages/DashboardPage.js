import React from 'react';
import { useData } from '../contexts/DataContext';

export default function DashboardPage() {
  const { data } = useData();
  const totalAlunos = data.alunos.length;
  const totalPlanos = data.planos.length;
  const totalPagamentos = data.pagamentos.length;
  const inadimplentes = data.alunos.filter((aluno) => aluno.statusMensalidade === 'Atrasado').length;

  return (
    <div className="dashboard-grid">
      <section className="card summary-card red">
        <h3>Alunos Cadastrados</h3>
        <p>{totalAlunos}</p>
      </section>
      <section className="card summary-card blue">
        <h3>Planos Disponíveis</h3>
        <p>{totalPlanos}</p>
      </section>
      <section className="card summary-card pink">
        <h3>Pagamentos Registrados</h3>
        <p>{totalPagamentos}</p>
      </section>
      <section className="card summary-card red-light">
        <h3>Alunos Inadimplentes</h3>
        <p>{inadimplentes}</p>
      </section>
    </div>
  );
}
