import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AlterarSenhaPage() {
  const { user, updatePassword } = useAuth();
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
    if (senhaAtual !== user.senha) {
      setMensagem('A senha atual está incorreta.');
      return;
    }
    updatePassword(user.id, novaSenha);
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmacao('');
    setMensagem('Senha alterada com sucesso.');
  };

  return (
    <div className="form-card">
      <h2>Alterar Senha</h2>
      {mensagem && <div className="alert success">{mensagem}</div>}
      <form onSubmit={handleSubmit}>
        <label>
          Senha atual
          <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} required />
        </label>
        <label>
          Nova senha
          <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} required />
        </label>
        <label>
          Confirmar nova senha
          <input type="password" value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} required />
        </label>
        <button type="submit" className="primary-button">Salvar</button>
      </form>
    </div>
  );
}
