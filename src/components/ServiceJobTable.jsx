import React, { useState } from "react";
import ServiceJobModal from "./ServiceJobModal";
import "./ServiceJobTable.css";

function ServiceJobTable({ services = [], onDelete, refresh }) {
  const [selected, setSelected] = useState(null);

  const openEdit = (service) => setSelected(service);
  const closeEdit = () => setSelected(null);

  const formatDate = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("pt-BR");
  };

  const formatTime = (t) => t || "-";

  return (
    <div className="service-table-container">
      <table className="service-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Cliente</th>
            <th>Funcionário</th>
            <th>Data Início</th>
            <th>Hora Início</th>
            <th>Valor Serviço</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {services && services.length > 0 ? services.map(s => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name || "-"}</td>
              <td>{s.client?.name || "-"}</td>
              <td>{s.employee?.name || "-"}</td>
              <td>{formatDate(s.initDate)}</td>
              <td>{formatTime(s.initTime)}</td>
              <td>R$ {s.serviceValue?.toFixed ? s.serviceValue.toFixed(2) : s.serviceValue}</td>
              <td>{s.status || "-"}</td>
              <td className="actions">
                <button className="edit-btn" onClick={() => openEdit(s)}>Editar</button>
                <button className="delete-btn" onClick={() => onDelete(s.id)}>Excluir</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="9" style={{textAlign:"center"}}>Nenhum serviço encontrado.</td></tr>
          )}
        </tbody>
      </table>

      {selected && <ServiceJobModal service={selected} closeModal={closeEdit} refresh={refresh} />}
    </div>
  );
}

export default ServiceJobTable;
