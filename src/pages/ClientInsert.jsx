import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ClientInsert.css";

function ClientInsert() {
  const navigate = useNavigate();
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
    healthPlan: ""
  });

  const fetchAddressByCep = async (cep) => {
  const cleanedCep = cep.replace(/\D/g, '');

  //Lógica viaCEP
  if (cleanedCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert("CEP não encontrado");
        return;
      }

      setClient((prev) => ({
        ...prev,
        city: data.localidade,
        neighborhood: data.bairro,
        state: data.uf,
        localAddress: data.logradouro
      }));

    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setClient({ ...client, [e.target.name]: e.target.value });

    if (name === "cep") {
      fetchAddressByCep(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/clients", client);

      if (response.status >= 200 && response.status < 300) {
        alert("Cliente cadastrado com sucesso!");
        navigate("/clients");
      } else {
        throw new Error("Status não OK");
      }
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error);

      if (error.response && error.response.data) {
        const data = error.response.data;

        if (data.errors && Array.isArray(data.errors)) {
          const mensagens = data.errors.map((err) => `• ${err.message}`).join("\n");
          alert(`Erro de validação:\n${mensagens}`);
        } else {
          alert(data.message || "Erro ao cadastrar cliente.");
        }
      } else {
        alert("Erro inesperado. Tente novamente.");
      }
    }
  };

  return (
    <div className="client-insert-container">
      <div className="client-insert-card">
        <h2>Cadastrar Novo Cliente</h2>
        <form onSubmit={handleSubmit} className="compact-form">
          
          <div className="form-group full-width">
            <label>Nome: *</label>
            <input type="text" name="name" value={client.name} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF: *</label>
              <input type="text" name="cpf" value={client.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
            </div>
            <div className="form-group">
              <label>Nascimento:</label>
              <input type="date" name="birth" value={client.birth} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-3">
              <label>Email: *</label>
              <input type="email" name="email" value={client.email} onChange={handleChange} required />
            </div>
            <div className="form-group flex-2">
              <label>Telefone:</label>
              <input type="text" name="phone" value={client.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CEP:</label>
              <input type="text" name="cep" value={client.cep} onChange={handleChange} placeholder="00000-000" />
            </div>
            <div className="form-group">
              <label>Estado (UF):</label>
              <input type="text" name="state" value={client.state} onChange={handleChange} maxLength={2} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-2">
              <label>Cidade:</label>
              <input type="text" name="city" value={client.city} onChange={handleChange} />
            </div>
            <div className="form-group flex-2">
              <label>Bairro:</label>
              <input type="text" name="neighborhood" value={client.neighborhood} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Endereço:</label>
            <input type="text" name="localAddress" value={client.localAddress} onChange={handleChange} />
          </div>

          <div className="form-group full-width">
            <label>Plano de Saúde:</label>
            <input type="text" name="healthPlan" value={client.healthPlan} onChange={handleChange} />
          </div>

          <div className="client-insert-buttons">
            <button type="submit" className="btn-save">Salvar</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/clients")}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClientInsert;