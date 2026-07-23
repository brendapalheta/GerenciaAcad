import React from 'react';

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <section className="card summary-card red">
        <h3>Current MRR</h3>
        <p>R$ 12.4k</p>
      </section>
      <section className="card summary-card blue">
        <h3>Current Customers</h3>
        <p>16,601</p>
      </section>
      <section className="card summary-card pink">
        <h3>Active Customers</h3>
        <p>33%</p>
      </section>
      <section className="card summary-card red-light">
        <h3>Churn Rate</h3>
        <p>2%</p>
      </section>
    </div>
  );
}
