import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AlunosPage from './pages/AlunosPage';
import PersonalsPage from './pages/PersonalsPage';
import PlanosPage from './pages/PlanosPage';
import PagamentosPage from './pages/PagamentosPage';
import AvaliacoesPage from './pages/AvaliacoesPage';
import TreinosPage from './pages/TreinosPage';
import AlterarSenhaPage from './pages/AlterarSenhaPage';
import Layout from './components/Layout';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="alunos" element={<AlunosPage />} />
            <Route path="personals" element={<PersonalsPage />} />
            <Route path="planos" element={<PlanosPage />} />
            <Route path="pagamentos" element={<PagamentosPage />} />
            <Route path="avaliacoes" element={<AvaliacoesPage />} />
            <Route path="treinos" element={<TreinosPage />} />
            <Route path="alterar-senha" element={<AlterarSenhaPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
