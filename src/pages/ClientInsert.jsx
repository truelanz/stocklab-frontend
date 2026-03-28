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
        <form onSubmit={handleSubmit}>

          <label>Nome: *</label>
          <input
            type="text"
            name="name"
            value={client.name}
            onChange={handleChange}
            required
          />

          <label>CPF: *</label>
          <input
            type="text"
            name="cpf"
            value={client.cpf}
            onChange={handleChange}
            placeholder="000.000.000-00"
            required
          />

          <label>Email: *</label>
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            required
          />

          <label>Telefone:</label>
          <input
            type="text"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            placeholder="(opcional)"
          />

          <label>Data de Nascimento:</label>
          <input
            type="date"
            name="birth"
            value={client.birth}
            onChange={handleChange}
          />

          <label>CEP:</label>
          <input
            type="text"
            name="cep"
            value={client.cep}
            onChange={handleChange}
            placeholder="00000-000"
          />

          <label>Cidade:</label>
          <input
            type="text"
            name="city"
            value={client.city}
            onChange={handleChange}
          />

          <label>Bairro:</label>
          <input
            type="text"
            name="neighborhood"
            value={client.neighborhood}
            onChange={handleChange}
          />

          <label>Estado:</label>
          <input
            type="text"
            name="state"
            value={client.state}
            onChange={handleChange}
            placeholder="UF"
            maxLength={2}
          />

          <label>Endereço:</label>
          <input
            type="text"
            name="localAddress"
            value={client.localAddress}
            onChange={handleChange}
          />

          <label>Plano de Saúde:</label>
          <input
            type="text"
            name="healthPlan"
            value={client.healthPlan}
            onChange={handleChange}
            placeholder="(opcional)"
          />

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