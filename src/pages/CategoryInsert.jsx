import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory, getCategories, deleteCategory, updateCategory } from "../services/CategoryService";
import "./CategoryInsert.css";

function CategoryInsert() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const loadCategories = async () => {
    try {
      const response = await getCategories(page, size, search);
      setCategories(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [page, search]);

  // 🔹 Criar categoria
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("O nome da categoria é obrigatório!");
      return;
    }

    try {
      await createCategory({ name: name.trim() });
      alert("Categoria criada com sucesso!");
      setName("");
      loadCategories();
    } catch (error) {
      console.error("Erro ao criar categoria:", error.response?.data || error.message);
      alert("Erro ao criar categoria. Verifique o console.");
    }
  };

  // 🔹 Excluir categoria
  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir esta categoria?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
    } catch (error) {
      console.error("Erro ao excluir categoria:", error.response?.data || error.message);
      alert("Erro ao excluir categoria. Verifique o console.");
    }
  };

  // 🔹 Editar categoria
  const handleEdit = async (id, oldName) => {
    const newName = prompt("Digite o novo nome da categoria:", oldName);
    if (!newName || newName.trim() === oldName) return;

    try {
      await updateCategory(id, { name: newName.trim() });
      alert("Categoria atualizada com sucesso!");
      loadCategories();
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error.response?.data || error.message);
      alert("Erro ao atualizar categoria. Verifique o console.");
    }
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
    <div className="category-insert-container">
      <h1>Adicionar Categoria</h1>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label>Nome da Categoria *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome da categoria"
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Salvar</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/products")}>Cancelar</button>
        </div>
      </form>

      {/* Barra de pesquisa */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar categoria..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        />
      </div>

      {/* Tabela de categorias */}
      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td className="actions">
                  <button className="edit-btn" onClick={() => handleEdit(cat.id, cat.name)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDelete(cat.id)}>Excluir</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>Nenhuma categoria encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="pagination">
        <button className="btn-prev" onClick={prevPage} disabled={page === 0}>Anterior</button>
        <span>Página {page + 1} de {totalPages}</span>
        <button className="btn-next" onClick={nextPage} disabled={page >= totalPages - 1}>Próximo</button>
      </div>
    </div>
  );
}

export default CategoryInsert;
