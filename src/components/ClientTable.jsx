import React, { useState, useEffect } from "react";
import "./ClientTable.css";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import add2 from "../assets/add2.png";

function ClientTable({ loadClients, onDelete }) {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editedClient, setEditedClient] = useState({});

  // === Carregar clientes paginados ===
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

  // === Filtro dinâmico ===
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cpf.includes(search) ||
      (client.phone && client.phone.includes(search))
  );

  // === Formata data ===
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  // === Modal edição ===
  const openEditModal = (client) => {
    setEditedClient({ ...client });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setEditedClient({ ...editedClient, [e.target.name]: e.target.value });
  };

  // === Salvar edição ===
  const handleSave = async () => {
    try {
      const updated = {
        name: editedClient.name,
        cpf: editedClient.cpf,
        phone: editedClient.phone,
        birth: editedClient.birth,
        localAddress: editedClient.localAddress,
      };

      const response = await api.put(`/clients/${editedClient.id}`, updated);

      if (response.status >= 200 && response.status < 300) {
        await fetchClients();
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
          <img src={add2}></img> <h2>Novo Cliente</h2>
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

      {/* ===== Paginação ===== */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", gap: "1rem" }}>
        <button
          className="btn-cancel"
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
        >
          ← Anterior
        </button>
        <span style={{ alignSelf: "center", color: "#ccc" }}>
          Página {page + 1} de {totalPages}
        </span>
        <button
          className="btn-save"
          onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : p))}
          disabled={page >= totalPages - 1}
        >
          Próxima →
        </button>
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Cliente</h2>

            <label>Nome:</label>
            <input name="name" value={editedClient.name} onChange={handleChange} />

            <label>CPF:</label>
            <input name="cpf" value={editedClient.cpf} onChange={handleChange} />

            <label>Telefone:</label>
            <input name="phone" value={editedClient.phone} onChange={handleChange} />

            <label>Nascimento:</label>
            <input type="date" name="birth" value={editedClient.birth} onChange={handleChange} />

            <label>Endereço:</label>
            <input name="localAddress" value={editedClient.localAddress} onChange={handleChange} />

            <div className="modal-buttons">
              <button onClick={handleSave} className="btn-save">
                Salvar
              </button>
              <button onClick={closeModal} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientTable;
