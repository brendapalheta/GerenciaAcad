import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

const defaultUsers = [
  { id: 1, nome: 'Administrador', email: 'admin@academia.com', perfil: 'Administrador', senha: 'admin123' },
  { id: 2, nome: 'Carlos Souza', email: 'personal@academia.com', perfil: 'Personal Trainer', senha: 'personal123' },
  { id: 3, nome: 'Lucas Silva', email: 'aluno@academia.com', perfil: 'Aluno', senha: 'aluno123' }
];

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorageState('gerencia-acad-users', defaultUsers);
  const [user, setUser] = useState(null);

  const login = (email, senha) => {
    const found = users.find((u) => u.email === email && u.senha === senha);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updatePassword = (id, novaSenha) => {
    setUsers((current) =>
      current.map((u) => (u.id === id ? { ...u, senha: novaSenha } : u))
    );
    if (user?.id === id) {
      setUser({ ...user, senha: novaSenha });
    }
  };

  const value = { user, login, logout, updatePassword };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
