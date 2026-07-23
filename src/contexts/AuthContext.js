import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const defaultUsers = [
  { id: 1, nome: 'Administrador', email: 'admin@academia.com', perfil: 'Administrador', senha: 'admin123' },
  { id: 2, nome: 'Personal Trainer', email: 'personal@academia.com', perfil: 'Personal Trainer', senha: 'personal123' },
  { id: 3, nome: 'Aluno', email: 'aluno@academia.com', perfil: 'Aluno', senha: 'aluno123' }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, senha) => {
    const found = defaultUsers.find((u) => u.email === email && u.senha === senha);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const value = { user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
