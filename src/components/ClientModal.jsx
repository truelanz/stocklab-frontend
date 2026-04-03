import React, { useState } from "react";
import api from "../services/api";
import "./ClientModal.css";

function ClientModal({ client, closeModal, loadClients }) {
  const [editedClient, setEditedClient] = useState({ ...client });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedData = {
        name: editedClient.name,
        cpf: editedClient.cpf,
        phone: editedClient.phone,
        birth: editedClient.birth,
        localAddress: editedClient.localAddress,
        cep: editedClient.cep,
        neighborhood: editedClient.neighborhood,
        city: editedClient.city,
        state: editedClient.state,
        healthPlan: editedClient.healthPlan,
        email: editedClient.email,
      };

      const response = await api.put(`/clients/${editedClient.id}`, updatedData);

      if (response.status >= 200 && response.status < 300) {
        await loadClients();
        alert("Cliente atualizado com sucesso!");
        closeModal();
      } else {
        throw new Error("Status não OK");
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      if (error.response && error.response.status === 400) {
        const data = error.response.data;
        if (data.errors && Array.isArray(data.errors)) {
          const mensagens = data.errors.map((err) => `• ${err.message}`).join("\n");
          alert(`Erro de validação:\n${mensagens}`);
        } else {
          alert(data.message || "Erro de validação ao atualizar cliente.");
        }
      } else {
        alert("Erro inesperado ao atualizar cliente. Tente novamente.");
      }
    }
  };

  return (
    <div className="cm-overlay" onClick={closeModal}>
      <div className="cm-card" onClick={(e) => e.stopPropagation()}>

        <div className="cm-header">
          <div className="cm-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h2 className="cm-title">Editar Cliente</h2>
            <p className="cm-subtitle">ID #{editedClient.id}</p>
          </div>
          <button className="cm-close" onClick={closeModal}>✕</button>
        </div>

        <div className="cm-section-label">Informações Pessoais</div>
        <div className="cm-grid">
          <div className="cm-field cm-full">
            <label>Nome completo</label>
            <input name="name" value={editedClient.name || ""} onChange={handleChange} placeholder="Nome do cliente" />
          </div>

          <div className="cm-field">
            <label>CPF</label>
            <input name="cpf" value={editedClient.cpf || ""} onChange={handleChange} placeholder="000.000.000-00" />
          </div>

          <div className="cm-field">
            <label>Nascimento</label>
            <input type="date" name="birth" value={editedClient.birth || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Telefone</label>
            <input name="phone" value={editedClient.phone || ""} onChange={handleChange} placeholder="(00) 00000-0000" />
          </div>

          <div className="cm-field">
            <label>Email</label>
            <input type="email" name="email" value={editedClient.email || ""} onChange={handleChange} placeholder="email@exemplo.com" />
          </div>

          <div className="cm-field cm-full">
            <label>Plano de Saúde</label>
            <input name="healthPlan" value={editedClient.healthPlan || ""} onChange={handleChange} placeholder="Nome do plano (opcional)" />
          </div>
        </div>

        <div className="cm-section-label">Endereço</div>
        <div className="cm-grid">
          <div className="cm-field">
            <label>CEP</label>
            <input name="cep" value={editedClient.cep || ""} onChange={handleChange} placeholder="00000-000" />
          </div>

          <div className="cm-field">
            <label>Estado</label>
            <input name="state" value={editedClient.state || ""} onChange={handleChange} placeholder="UF" maxLength={2} />
          </div>

          <div className="cm-field">
            <label>Cidade</label>
            <input name="city" value={editedClient.city || ""} onChange={handleChange} placeholder="Cidade" />
          </div>

          <div className="cm-field">
            <label>Bairro</label>
            <input name="neighborhood" value={editedClient.neighborhood || ""} onChange={handleChange} placeholder="Bairro" />
          </div>

          <div className="cm-field cm-full">
            <label>Endereço completo</label>
            <input name="localAddress" value={editedClient.localAddress || ""} onChange={handleChange} placeholder="Rua, número, complemento" />
          </div>
        </div>

        <div className="cm-actions">
          <button className="cm-btn-cancel" onClick={closeModal}>Cancelar</button>
          <button className="cm-btn-save" onClick={handleSave}>Salvar alterações</button>
        </div>

      </div>
    </div>
  );
}

export default ClientModal;