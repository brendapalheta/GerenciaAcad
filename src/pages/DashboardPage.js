import React from 'react';
import { useData } from '../contexts/DataContext';

export default function DashboardPage() {
  const { data } = useData();
  const totalAlunos = data.alunos.length;
  const totalPlanos = data.planos.length;
  const totalPagamentos = data.pagamentos.length;
  const inadimplentes = data.alunos.filter((aluno) => aluno.statusMensalidade === 'Atrasado').length;

  return (
    <div className="dashboard-grid dashboard-dashboard">
      <div className="dashboard-top">
        <div className="metrics-grid">
          <div className="metric-card metric-red">
            <div className="metric-label">Alunos Cadastrados</div>
            <div className="metric-value">{totalAlunos}</div>
          </div>
          <div className="metric-card metric-blue">
            <div className="metric-label">Planos Disponíveis</div>
            <div className="metric-value">{totalPlanos}</div>
          </div>
          <div className="metric-card metric-pink">
            <div className="metric-label">Pagamentos Registrados</div>
            <div className="metric-value">{totalPagamentos}</div>
          </div>
          <div className="metric-card metric-red-light">
            <div className="metric-label">Alunos Inadimplentes</div>
            <div className="metric-value">{inadimplentes}</div>
          </div>
        </div>

        <div className="dashboard-widgets">
          <div className="card chart-card">
            <div className="card-heading">
              <div>
                <h3>Trend</h3>
                <span>Novos x Renovações x Churn</span>
              </div>
              <div className="badge">This year</div>
            </div>
            <div className="trend-chart">
              {[70, 90, 60, 80, 95, 85, 100].map((height, index) => (
                <div key={index} className="trend-bar" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="trend-legends">
              <span className="legend-item red">New</span>
              <span className="legend-item blue">Renovals</span>
              <span className="legend-item pink">Churns</span>
            </div>
          </div>

          <div className="card donut-card">
            <div className="card-heading">
              <div>
                <h3>Sales</h3>
                <span>Plano distribution</span>
              </div>
              <div className="badge">342 sales</div>
            </div>
            <div className="donut-chart">
              <div className="donut-ring donut-ring-1" />
              <div className="donut-ring donut-ring-2" />
              <div className="donut-ring donut-ring-3" />
              <div className="donut-center">342</div>
            </div>
            <div className="donut-legend">
              <span>Basic Plan</span>
              <span>Pro Plan</span>
              <span>Enterprise Plan</span>
            </div>
          </div>

          <div className="card transactions-card">
            <div className="card-heading">
              <div>
                <h3>Transactions</h3>
                <span>Recent billing</span>
              </div>
              <button className="ghost-button">View all</button>
            </div>
            {[
              { name: 'S. Evergreen', status: 'Paid', value: '+49' },
              { name: 'B. Sterling', status: 'Pending', value: '+59' },
              { name: 'O. Meadows', status: 'Free', value: '+0' },
              { name: 'E. Frost', status: 'Overdue', value: '+19' }
            ].map((item, index) => (
              <div key={index} className="transaction-row">
                <div>{item.name}</div>
                <div className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</div>
                <div>R$ {item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="card tickets-card">
          <div className="card-heading">
            <div>
              <h3>Support Tickets</h3>
              <span>Atendimento e solicitações</span>
            </div>
            <button className="ghost-button">See all</button>
          </div>
          {[
            { title: 'Login issue', user: 'jessica.smith123@example.com', status: 'Open' },
            { title: 'Billing inquiry', user: 'david.jones456@gmail.com', status: 'Pending' },
            { title: 'Product malfunction', user: 'emily.wilson789@fictitiousmail.net', status: 'Closed' },
            { title: 'Feature request', user: 'andrew.johnson22@phonyinbox.org', status: 'Open' }
          ].map((ticket, index) => (
            <div key={index} className="ticket-row">
              <div>
                <div className="ticket-title">{ticket.title}</div>
                <div className="ticket-user">{ticket.user}</div>
              </div>
              <span className={`status-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
            </div>
          ))}
        </div>
        <div className="card map-card">
          <div className="card-heading">
            <div>
              <h3>Customer Demographic</h3>
              <span>Active vs Inactive</span>
            </div>
          </div>
          <div className="map-placeholder">Map visualization placeholder</div>
        </div>
      </div>
    </div>
  );
}
