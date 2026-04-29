import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { insertClient } from "../services/clientService"; // ✅ usa o service corrigido
import "./ClientInsert.css";

function ClientInsert() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",       
    birth: "",
    localAddress: "",
    cep: "",
    neighborhood: "",
    city: "",
    state: "",
    healthPlan: "",
  });

  const fetchAddressByCep = async (cep) => {
    const cleanedCep = cep.replace(/\D/g, "");
    if (cleanedCep.length !== 8) return;

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanedCep}/json/`
      );
      const data = await response.json();

      if (!data.erro) {
        setClient((prev) => ({
          ...prev,
          city: data.localidade,
          neighborhood: data.bairro,
          state: data.uf,
          localAddress: data.logradouro,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //insertClient usa Blob internamente — sem erros de Content-Type
      await insertClient(client, selectedFile);

      alert("Cliente cadastrado com sucesso!");
      navigate("/clients");
    } catch (error) {
      console.error("ERRO COMPLETO:", error);

      if (error.response) {
        console.error("STATUS:", error.response.status);
        console.error("DATA:", error.response.data);
        alert(
          error.response.data?.message ||
            JSON.stringify(error.response.data)
        );
      } else {
        console.error("SEM RESPONSE:", error.message);
        alert("Erro de rede ou CORS");
      }
    }
  };

  return (
    <div className="cm-overlay">
      <div className="cm-card">
        <div className="cm-header">
          <div className="cm-header-icon">👤</div>
          <div>
            <h2 className="cm-title">Cadastrar Novo Cliente</h2>
            <p className="cm-subtitle">
              Preencha os dados e anexe uma foto
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* FOTO */}
          <div className="photo-upload-container">
            <div
              className="photo-preview"
              onClick={() => fileInputRef.current.click()}
            >
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
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                setSelectedFile(file);
                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            <label className="photo-label">Foto do Cliente</label>
          </div>

          {/* INFORMAÇÕES PESSOAIS */}
          <div className="cm-section-label">Informações Pessoais</div>

          <div className="cm-grid">
            <div className="cm-field cm-full">
              <label>Nome: *</label>
              <input
                type="text"
                name="name"
                value={client.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cm-field">
              <label>CPF: *</label>
              {/*name="CPF" em maiúsculo para bater com o DTO */}
              <input
                type="text"
                name="cpf"
                value={client.cpf}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cm-field">
              <label>Nascimento:</label>
              <input
                type="date"
                name="birth"
                value={client.birth}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field">
              <label>Email: *</label>
              <input
                type="email"
                name="email"
                value={client.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cm-field">
              <label>Telefone:</label>
              <input
                type="text"
                name="phone"
                value={client.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ENDEREÇO & PLANO */}
          <div className="cm-section-label">Endereço & Plano</div>

          <div className="cm-grid">
            <div className="cm-field">
              <label>CEP:</label>
              <input
                type="text"
                name="cep"
                value={client.cep}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field">
              <label>Estado:</label>
              <input
                type="text"
                name="state"
                value={client.state}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field">
              <label>Cidade:</label>
              <input
                type="text"
                name="city"
                value={client.city}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field">
              <label>Bairro:</label>
              <input
                type="text"
                name="neighborhood"
                value={client.neighborhood}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field cm-full">
              <label>Endereço:</label>
              <input
                type="text"
                name="localAddress"
                value={client.localAddress}
                onChange={handleChange}
              />
            </div>

            <div className="cm-field cm-full">
              <label>Plano de Saúde:</label>
              <input
                type="text"
                name="healthPlan"
                value={client.healthPlan}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="cm-actions">
            <button
              type="button"
              className="cm-btn-cancel"
              onClick={() => navigate("/clients")}
            >
              Cancelar
            </button>

            <button type="submit" className="cm-btn-save">
              Salvar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientInsert;