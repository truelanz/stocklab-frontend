import React, { useEffect, useState } from "react";
import "./ServiceJob.css";
import { getServiceJobs, searchServiceJobs, deleteServiceJob } from "../services/serviceJobService";
import ServiceJobTable from "../components/ServiceJobTable";
import { useNavigate } from "react-router-dom";

function ServiceJob() {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // filtros para busca dinâmica (exemplo: name, status, clientName, employeeName, date ranges)
  const [filters, setFilters] = useState({
    text: "",        // pesquisa livre (pode cobrir name/description/client/employee)
    status: "",      // opcional
    clientId: null,
    employeeId: null,
    initDateFrom: "",
    initDateTo: ""
  });

  const navigate = useNavigate();

  const loadPage = async (p = page) => {
    try {
      setLoading(true);
      const data = await getServiceJobs(p, size);
      setServices(data.content || data);
      setTotalPages(data.totalPages || 1);
      setPage(p);
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
      alert("Erro ao carregar serviços. Veja console.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(0);
    // eslint-disable-next-line
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await searchServiceJobs(filters, 0, size);
      setServices(data.content || data);
      setTotalPages(data.totalPages || 1);
      setPage(0);
    } catch (err) {
      console.error("Erro na busca:", err);
      alert("Erro na busca. Veja console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este serviço?")) return;
    try {
      await deleteServiceJob(id);
      alert("Serviço excluído com sucesso!");
      // recarrega a página atual
      loadPage(0);
    } catch (error) {
        alert(error.response?.data?.message || "Erro inesperado ao processar a solicitação.");
    }
  };

  const prevPage = () => {
    if (page > 0) loadPage(page - 1);
  };
  const nextPage = () => {
    if (page < totalPages - 1) loadPage(page + 1);
  };

  return (
    <div className="servicejob-page">
      <div className="servicejob-header">
        <h1>Serviços</h1>
        <div className="servicejob-actions">
          <button className="btn-save" onClick={() => navigate("/services/new")}>+ Novo Serviço</button>
        </div>
      </div>

      {/* ===== Busca dinâmica (form simples) ===== */}
      <form className="servicejob-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Pesquisar (nome, cliente, funcionário, descrição)..."
          value={filters.text}
          onChange={(e) => setFilters({ ...filters, text: e.target.value })}
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">Todos os status</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="FINISHED">FINISHED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <input
          type="date"
          value={filters.initDateFrom}
          onChange={(e) => setFilters({ ...filters, initDateFrom: e.target.value })}
          title="Data início (de)"
        />
        <input
          type="date"
          value={filters.initDateTo}
          onChange={(e) => setFilters({ ...filters, initDateTo: e.target.value })}
          title="Data início (até)"
        />

        <button type="submit" className="btn-find">Buscar</button>
        <button type="button" className="btn-clean" onClick={() => { setFilters({ text: "", status: "", clientId: null, employeeId: null, initDateFrom: "", initDateTo: "" }); loadPage(0); }}>
          Limpar
        </button>
      </form>

      <ServiceJobTable services={services} onDelete={handleDelete} refresh={() => loadPage(page)} />

      <div className="pagination">
        <button className="btn-back" onClick={prevPage} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button className="btn-next" onClick={nextPage} disabled={page >= totalPages - 1}>Próximo</button>
      </div>

      {loading && <div className="loading">Carregando...</div>}
    </div>
  );
}

export default ServiceJob;
