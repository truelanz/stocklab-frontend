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
        email: editedClient.email
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
          const mensagens = data.errors.map(err => `• ${err.message}`).join("\n");
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Editar Cliente</h2>

        <div className="form-group">
          <label>Nome:</label>
          <input name="name" value={editedClient.name || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>CPF:</label>
          <input name="cpf" value={editedClient.cpf || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={editedClient.email || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Telefone:</label>
          <input name="phone" value={editedClient.phone || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Data de Nascimento:</label>
          <input type="date" name="birth" value={editedClient.birth || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>CEP:</label>
          <input name="cep" value={editedClient.cep || ""} onChange={handleChange} placeholder="00000-000" />
        </div>

        <div className="form-group">
          <label>Cidade:</label>
          <input name="city" value={editedClient.city || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bairro:</label>
          <input name="neighborhood" value={editedClient.neighborhood || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Estado:</label>
          <input name="state" value={editedClient.state || ""} onChange={handleChange} placeholder="UF" maxLength={2} />
        </div>

        <div className="form-group">
          <label>Endereço:</label>
          <input name="localAddress" value={editedClient.localAddress || ""} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Plano de Saúde:</label>
          <input name="healthPlan" value={editedClient.healthPlan || ""} onChange={handleChange} />
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>Salvar</button>
          <button className="cancel-btn" onClick={closeModal}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;