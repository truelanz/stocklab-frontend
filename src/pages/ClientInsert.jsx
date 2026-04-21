import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ClientInsert.css";

// 1. CORREÇÃO NA FUNÇÃO DE UPLOAD: Removido as chaves extras do formData
export const uploadClientImage = (clientId, image) => {
  const formData = new FormData();
  formData.append("file", image); 

  // Passamos o 'formData' diretamente como segundo argumento
  return api.post(`/upload/image/${clientId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

function ClientInsert() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [client, setClient] = useState({
    name: "", email: "", phone: "", cpf: "", birth: "",
    localAddress: "", cep: "", neighborhood: "", city: "",
    state: "", healthPlan: ""
  });

  // 2. CORREÇÃO NO MANUSEIO DA IMAGEM: Garante que o arquivo bruto vá para o estado
  const handleImageChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      setSelectedFile(file); // Aqui guardamos o arquivo real para o upload posterior
      setPreview(URL.createObjectURL(file)); // Aqui apenas a imagem para o usuário ver
    }
  };

  const fetchAddressByCep = async (cep) => {
    const cleanedCep = cep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setClient((prev) => ({
          ...prev,
          city: data.localidade,
          neighborhood: data.bairro,
          state: data.uf,
          localAddress: data.logradouro
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
    if (name === "cep") fetchAddressByCep(value);
  };

  // 3. LOG DE VERIFICAÇÃO NO SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/clients", client);

      if (response.status >= 200 && response.status < 300) {
        const newClientId = response.data.id;

        // Se o usuário selecionou uma foto, dispara o upload usando o ID gerado
        if (selectedFile && newClientId) {
          await uploadClientImage(newClientId, selectedFile);
        }

        alert("Cliente cadastrado com sucesso!");
        navigate("/clients");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert(error.response?.data?.message || "Erro ao cadastrar.");
    }
  };

  return (
    <div className="cm-overlay">
      <div className="cm-card">
        <div className="cm-header">
          <div className="cm-header-icon">👤</div>
          <div>
            <h2 className="cm-title">Cadastrar Novo Cliente</h2>
            <p className="cm-subtitle">Preencha os dados e anexe uma foto</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* SEÇÃO DE UPLOAD CENTRALIZADA */}
          <div className="photo-upload-container">
            <div className="photo-preview" onClick={() => fileInputRef.current.click()}>
              {preview ? (
                <img src={preview} alt="Preview" />
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
            <label className="photo-label">Foto do Cliente</label>
          </div>

          <div className="cm-section-label">Informações Pessoais</div>
          <div className="cm-grid">
            <div className="cm-field cm-full">
              <label>Nome: *</label>
              <input type="text" name="name" value={client.name} onChange={handleChange} required />
            </div>

            <div className="cm-field">
              <label>CPF: *</label>
              <input type="text" name="cpf" value={client.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
            </div>
            <div className="cm-field">
              <label>Nascimento:</label>
              <input type="date" name="birth" value={client.birth} onChange={handleChange} />
            </div>

            <div className="cm-field">
              <label>Email: *</label>
              <input type="email" name="email" value={client.email} onChange={handleChange} required />
            </div>
            <div className="cm-field">
              <label>Telefone:</label>
              <input type="text" name="phone" value={client.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="cm-section-label">Endereço & Plano</div>
          <div className="cm-grid">
            <div className="cm-field">
              <label>CEP:</label>
              <input type="text" name="cep" value={client.cep} onChange={handleChange} placeholder="00000-000" />
            </div>
            <div className="cm-field">
              <label>Estado (UF):</label>
              <input type="text" name="state" value={client.state} onChange={handleChange} maxLength={2} />
            </div>

            <div className="cm-field">
              <label>Cidade:</label>
              <input type="text" name="city" value={client.city} onChange={handleChange} />
            </div>
            <div className="cm-field">
              <label>Bairro:</label>
              <input type="text" name="neighborhood" value={client.neighborhood} onChange={handleChange} />
            </div>

            <div className="cm-field cm-full">
              <label>Endereço:</label>
              <input type="text" name="localAddress" value={client.localAddress} onChange={handleChange} />
            </div>

            <div className="cm-field cm-full">
              <label>Plano de Saúde:</label>
              <input type="text" name="healthPlan" value={client.healthPlan} onChange={handleChange} />
            </div>
          </div>

          <div className="cm-actions">
            <button type="button" className="cm-btn-cancel" onClick={() => navigate("/clients")}>
              Cancelar
            </button>
            <button type="submit" className="cm-btn-save">Salvar Cadastro</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientInsert;