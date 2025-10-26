import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/EmployeeService";
import "./Employee.css";

function Employee() {
  const [name, setName] = useState("");
  const [employees, setEmployees] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadEmployees = async () => {
    try {
      const response = await getEmployees(page, size, search);
      setEmployees(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [page, search]);

  //Criar funcionário
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome do funcionário é obrigatório!");
      return;
    }

    try {
      await createEmployee({ name: name.trim() });
      alert("Funcionário criado com sucesso!");
      setName("");
      loadEmployees();
    } catch (error) {
      console.error("Erro ao criar funcionário:", error.response?.data || error.message);
      alert("Erro ao criar funcionário. Verifique o console.");
    }
  };

  //Editar funcionário
  const handleEdit = async (id, oldName) => {
    const newName = prompt("Digite o novo nome do funcionário:", oldName);
    if (!newName || newName.trim() === oldName) return;

    try {
      await updateEmployee(id, { name: newName.trim() });
      alert("Funcionário atualizado com sucesso!");
      loadEmployees();
    } catch (error) {
      console.error("Erro ao atualizar funcionário:", error.response?.data || error.message);
      alert("Erro ao atualizar funcionário. Verifique o console.");
    }
  };

  //Excluir funcionário
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este funcionário?")) return;

    try {
      await deleteEmployee(id);
      alert("Funcionário excluído com sucesso!");
      loadEmployees();
    } catch (error) {
      console.error("Erro ao excluir funcionário:", error.response?.data || error.message);
      alert("Erro ao excluir funcionário. Verifique o console.");
    }
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="employee-container">
      <h1>Gerenciar Funcionários</h1>

      {/*Formulário de Inserção */}
      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-group">
          <label>Nome do Funcionário *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do funcionário"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Salvar</button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>
        </div>
      </form>

      {/*Barra de Pesquisa */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar funcionário..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      {/*Tabela */}
      <div className="employee-table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(emp.id, emp.name)}>
                    Editar
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  Nenhum funcionário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/*Paginação */}
      <div className="pagination">
        <button className="btn-prev" onClick={prevPage} disabled={page === 0}>
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button
          className="btn-next"
          onClick={nextPage}
          disabled={page >= totalPages - 1}
        >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Employee;
