import React, { useState, useEffect } from "react";
import "./ClientTable.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import add2 from "../assets/add2.png";
import ClientModal from "./ClientModal";

function ClientTable({ loadClients, onDelete }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchClients = async () => {
    try {
      const response = await api.get(`/clients?page=${page}&size=${size}`);
      const data = response.data.content ? response.data : { content: response.data, totalPages: 1 };
      setClients(data.content);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page]);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cpf.includes(search) ||
      (client.phone && client.phone.includes(search))
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const openEditModal = (client) => {
    setSelectedClient(client);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
  };

  return (
    <div className="product-table-container">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="add-client-button" alt="Add Button" onClick={() => navigate("/clients/new")}>
          <img src={add2} alt="Adicionar" /> <h2>Novo Cliente</h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cliente por nome, CPF ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Telefone</th>
            <th>Nascimento</th>
            <th>Endereço</th>
            <th>Registrado em</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.cpf}</td>
                <td>{c.phone || "-"}</td>
                <td>{c.birth ? formatDate(c.birth) : "-"}</td>
                <td>{c.localAddress || "-"}</td>
                <td>{formatDate(c.dateRegister)}</td>
                <td className="actions">
                  <button onClick={() => openEditModal(c)} className="edit-btn">
                    Editar
                  </button>
                  <button onClick={() => onDelete(c.id)} className="delete-btn">
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                Nenhum cliente encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="btn-back"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          ← Anterior
        </button>
        <span style={{ alignSelf: "center", color: "#ccc" }}>
          Página {page + 1} de {totalPages}
        </span>
        <button
          className="btn-next"
          onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : p))}
          disabled={page >= totalPages - 1}
        >
          Próxima →
        </button>
      </div>

      {showModal && selectedClient && (
        <ClientModal
          client={selectedClient}
          closeModal={closeModal}
          loadClients={fetchClients}
        />
      )}
    </div>
  );
}

export default ClientTable;