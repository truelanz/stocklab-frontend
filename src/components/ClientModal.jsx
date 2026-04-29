import React, { useState, useRef, useEffect } from "react";
import { updateClient } from "../services/clientService"; // ✅ usa o service corrigido
import "./ClientModal.css";

function ClientModal({ client, closeModal, loadClients }) {
  const [editedClient, setEditedClient] = useState({ ...client });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  //Carrega a imagem do banco (photoBase64) ao abrir o modal
  useEffect(() => {
    if (client.photoBase64) {
      setPreview(`data:image/jpeg;base64,${client.photoBase64}`);
    } else {
      setPreview(null);
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      // Monta apenas os campos que o DTO espera (sem photoBase64, sem id no body)
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

      //updateClient já monta o FormData com Blob corretamente
      await updateClient(editedClient.id, updatedData, selectedFile);

      await loadClients();
      alert("Cliente atualizado com sucesso!");
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erro ao salvar alterações.";
      alert(msg);
    }
  };

  return (
    <div className="cm-overlay" onClick={closeModal}>
      <div className="cm-card" onClick={(e) => e.stopPropagation()}>
        <div className="cm-header">
          <div className="cm-header-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

        {/* Foto */}
        <div className="photo-upload-container">
          <div className="photo-preview" onClick={() => fileInputRef.current.click()}>
            {preview ? (
              <img
                src={preview}
                alt="Foto"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100?text=Sem+Foto"; }}
              />
            ) : (
              <div className="photo-placeholder">
                <span>📷</span>
              </div>
            )}
            <div className="photo-add-btn">+</div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />
          <label className="photo-label">Trocar Imagem</label>
        </div>

        <div className="cm-section-label">Informações Pessoais</div>
        <div className="cm-grid">
          <div className="cm-field cm-full">
            <label>Nome completo</label>
            <input name="name" value={editedClient.name || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>CPF</label>
            {/*campo CPF em maiúsculo conforme o DTO do backend */}
            <input name="CPF" value={editedClient.cpf || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Nascimento</label>
            <input type="date" name="birth" value={editedClient.birth || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Telefone</label>
            <input name="phone" value={editedClient.phone || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Email</label>
            <input type="email" name="email" value={editedClient.email || ""} onChange={handleChange} />
          </div>

          <div className="cm-field cm-full">
            <label>Plano de Saúde</label>
            <input name="healthPlan" value={editedClient.healthPlan || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="cm-section-label">Endereço</div>
        <div className="cm-grid">
          <div className="cm-field">
            <label>CEP</label>
            <input name="cep" value={editedClient.cep || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Estado (UF)</label>
            <input name="state" value={editedClient.state || ""} onChange={handleChange} maxLength={2} />
          </div>

          <div className="cm-field">
            <label>Cidade</label>
            <input name="city" value={editedClient.city || ""} onChange={handleChange} />
          </div>

          <div className="cm-field">
            <label>Bairro</label>
            <input name="neighborhood" value={editedClient.neighborhood || ""} onChange={handleChange} />
          </div>

          <div className="cm-field cm-full">
            <label>Endereço completo</label>
            <input name="localAddress" value={editedClient.localAddress || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="cm-actions">
          <button className="cm-btn-cancel" onClick={closeModal}>Cancelar</button>
          <button className="cm-btn-save" onClick={handleSave}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
}

export default ClientModal;