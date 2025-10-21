import React, { useEffect, useState } from "react";
import ClientTable from "../components/ClientTable";
import api from "../services/api";
import "./Client.css";

function Client() {
  const [clients, setClients] = useState([]);

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data.content || response.data);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este cliente?")) {
      try {
        await api.delete(`/clients/${id}`);
        await loadClients();
        alert("Cliente excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir cliente:", error);
        alert("Erro ao excluir cliente.");
      }
    }
  };

  return (
    <div className="client-page">
      <h1 className="client-title">Gerenciamento de Clientes</h1>
      <ClientTable clients={clients} onDelete={handleDelete} loadClients={loadClients} />
    </div>
  );
}

export default Client;
