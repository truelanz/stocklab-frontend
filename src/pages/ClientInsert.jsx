import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ClientInsert.css";

function ClientInsert() {
  const navigate = useNavigate();
  const [client, setClient] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // envia para o backend
      const response = await api.post("/clients", client);

      if (response.status >= 200 && response.status < 300) {
        alert("Cliente cadastrado com sucesso!");
        navigate("/"); // volta para a tabela
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
          <label>Nome:</label>
          <input
            type="text"
            name="name"
            value={client.name}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
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
