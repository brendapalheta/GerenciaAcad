import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const DataContext = createContext();

const initialState = {
  alunos: [
    {
      id: 1,
      nome: 'Lucas Silva',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-0001',
      email: 'lucas@aluno.com',
      dataNascimento: '1996-05-18',
      planoId: 1,
      personalId: 2,
      statusMensalidade: 'Em dia',
      vencimento: '2026-08-15'
    },
    {
      id: 2,
      nome: 'Mariana Costa',
      cpf: '987.654.321-00',
      telefone: '(11) 98888-0002',
      email: 'mariana@aluno.com',
      dataNascimento: '1992-11-03',
      planoId: 2,
      personalId: 2,
      statusMensalidade: 'Atrasado',
      vencimento: '2026-07-01'
    }
  ],
  personals: [
    { id: 2, nome: 'Carlos Souza', email: 'personal@academia.com' }
  ],
  planos: [
    { id: 1, nome: 'Mensal Gold', valor: 199.9, duracao_meses: 1, descricao: 'Acesso completo à academia e aulas.' },
    { id: 2, nome: 'Plano Fitness', valor: 149.9, duracao_meses: 1, descricao: 'Academia + avaliação semanal.' }
  ],
  pagamentos: [
    { id: 1, alunoId: 1, valor: 199.9, dataPagamento: '2026-07-05', descricao: 'Mensalidade Julho' },
    { id: 2, alunoId: 2, valor: 149.9, dataPagamento: '2026-06-04', descricao: 'Mensalidade Junho' }
  ],
  avaliacoes: [
    {
      id: 1,
      alunoId: 1,
      data: '2026-07-10',
      peso: 75.2,
      altura: 1.78,
      imc: 23.7,
      percentualGordura: 16.5,
      massaMuscular: 32.1,
      circunferencias: 'Peito 100cm, Cintura 82cm, Quadril 98cm'
    }
  ],
  treinos: [
    {
      id: 1,
      alunoId: 1,
      personalId: 2,
      objetivo: 'Hipertrofia',
      nivel: 'Intermediário',
      frequenciaSemanal: 4,
      restricoes: 'Nenhuma',
      detalhes: 'Segunda: Peito/Tríceps\nTerça: Costas/Bíceps\nQuinta: Pernas\nSexta: Ombros/Abdômen'
    }
  ]
};

function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export function DataProvider({ children }) {
  const [data, setData] = useLocalStorageState('gerencia-acad-data', initialState);

  const addEntity = (key, entity) => {
    setData((current) => ({
      ...current,
      [key]: [...current[key], entity]
    }));
  };

  const updateEntity = (key, updated) => {
    setData((current) => ({
      ...current,
      [key]: current[key].map((item) => (item.id === updated.id ? updated : item))
    }));
  };

  const deleteEntity = (key, id) => {
    setData((current) => ({
      ...current,
      [key]: current[key].filter((item) => item.id !== id)
    }));
  };

  const nextId = (key) => Math.max(0, ...data[key].map((item) => item.id)) + 1;

  const generateTreinoPersonalizado = (aluno, values) => {
    return `Treino personalizado para ${aluno.nome}:\nObjetivo: ${values.objetivo}\nNível: ${values.nivel}\nFrequência: ${values.frequenciaSemanal}x por semana\nRestrições: ${values.restricoes || 'Nenhuma'}\n\nSegunda: Agachamento, Leg Press, Extensora\nQuarta: Supino, Remada, Desenvolvimento\nSexta: Puxada, Bíceps, Abdômen`;
  };

  const value = useMemo(
    () => ({
      data,
      addEntity,
      updateEntity,
      deleteEntity,
      nextId,
      generateTreinoPersonalizado
    }),
    [data]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  return useContext(DataContext);
}
