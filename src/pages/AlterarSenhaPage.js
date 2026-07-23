import React, { useState } from 'react';

export default function AlterarSenhaPage() {
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!senhaAtual || !novaSenha || !confirmacao) {
      setMensagem('Preencha todos os campos.');
      return;
    }
    if (novaSenha !== confirmacao) {
      setMensagem('A nova senha e a confirmação não coincidem.');
      return;
    }
    setMensagem('Senha alterada com sucesso! (simulado)');
  };

  return (
    <div className="form-card">
      <h2>Alterar Senha</h2>
      {mensagem && <div className="alert success">{mensagem}</div>}
      <form onSubmit={handleSubmit}>
        <label>Senha atual</label>
        <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
        <label>Nova senha</label>
        <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
        <label>Confirmar nova senha</label>
        <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required />
        <button type="submit">Salvar</button>
      </form>
    </div>
  );
}
