import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
} from "../services/CategoryService"; // ajuste o caminho se necessário
import api from "../services/api"; // para exclusão direta

function CategoryTable() {
  const [categories, setCategories] = useState([]);

  // ✅ Carregar categorias ao iniciar
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.content || response.data); // compatível com paginação
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  // Editar categoria
  const handleEdit = async (id) => {
    const newName = prompt("Novo nome da categoria:");
    if (newName) {
      try {
        await updateCategory(id, { name: newName });
        alert("Categoria atualizada com sucesso!");
        loadCategories();
      } catch (error) {
        console.error("Erro ao atualizar categoria:", error);
      }
    }
  };

  //Excluir categoria
  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir esta categoria?")) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Erro ao excluir categoria:", error);
      }
    }
  };

  return (
    <div>
      <CategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default CategoryTable;
