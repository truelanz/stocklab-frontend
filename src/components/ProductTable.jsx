import React, { useState, useEffect } from "react";
import "./ProductTable.css";
import api from "../services/api";
import { getCategories } from "../services/CategoryService";

function ProductTable({ products, onDelete, loadProducts }) {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [editedProduct, setEditedProduct] = useState({
    id: "",
    name: "",
    currentQuantity: "",
    productValue: "",
    validity: "",
    categoryId: ""
  });

  // Carrega categorias (paginação: page 0, size 100)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories(0, 100);
        const data = response.content ? response.content : response;
        setCategories(data);
        setFilteredCategories(data);
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);
      }
    };
    loadCategories();
  }, []);

  // Filtra categorias conforme o usuário digita
  useEffect(() => {
    if (!searchCategory.trim()) {
      setFilteredCategories(categories);
    } else {
      setFilteredCategories(
        categories.filter((c) =>
          c.name.toLowerCase().includes(searchCategory.toLowerCase())
        )
      );
    }
  }, [searchCategory, categories]);

  // Abre o modal com dados do produto
  const openEditModal = (product) => {
    setEditedProduct({
      id: product.id,
      name: product.name,
      currentQuantity: product.currentQuantity,
      productValue: product.productValue,
      validity: product.validity,
      categoryId: product.category?.id || ""
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  // Salva alterações
  const handleSave = async () => {
    try {
      const updatedData = {
        name: editedProduct.name,
        currentQuantity: Number(editedProduct.currentQuantity),
        productValue: Number(editedProduct.productValue),
        categoryId: Number(editedProduct.categoryId),
        validity: editedProduct.validity
      };

      const response = await api.put(`/products/${editedProduct.id}`, updatedData);

      // Se status for 2xx, considera sucesso
      if (response.status >= 200 && response.status < 300) {
        // Atualiza lista localmente sem recarregar
        const updatedList = products.map((p) =>
          p.id === editedProduct.id
            ? { ...p, ...updatedData, category: categories.find(c => c.id === updatedData.categoryId) }
            : p
        );

        loadProducts(updatedList);
        alert("Produto atualizado com sucesso!");
        closeModal();
      } else {
        throw new Error("Status não OK");
      }
    } catch (error) {
      const status = error.response?.status;
      // Só alerta se status for realmente fora do range 2xx
      if (!status || status < 200 || status >= 300) {
        console.error("Erro ao atualizar produto:", error);
        alert("Erro ao atualizar produto. Verifique os campos e tente novamente.");
      } else {
        console.log("Requisição retornou 2xx mas caiu no catch (Axios parsing issue):", error);
      }
    }
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Quantidade</th>
            <th>Valor</th>
            <th>Validade</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.currentQuantity}</td>
                <td>R$ {p.productValue}</td>
                <td>{p.validity}</td>
                <td>{p.category?.name || "-"}</td>
                <td className="actions">
                  <button onClick={() => openEditModal(p)} className="edit-btn">
                    Editar
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(p.id)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ===== Modal de Edição ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Produto</h2>

            <label>Nome:</label>
            <input
              type="text"
              name="name"
              value={editedProduct.name}
              onChange={handleChange}
            />

            <label>Quantidade:</label>
            <input
              type="number"
              name="currentQuantity"
              value={editedProduct.currentQuantity}
              onChange={handleChange}
            />

            <label>Valor:</label>
            <input
              type="number"
              name="productValue"
              value={editedProduct.productValue}
              onChange={handleChange}
            />

            <label>Validade:</label>
            <input
              type="date"
              name="validity"
              value={editedProduct.validity}
              onChange={handleChange}
            />

            <label>Categoria:</label>
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="category-search"
            />
            <select
              name="categoryId"
              value={editedProduct.categoryId}
              onChange={handleChange}
              className="category-select"
            >
              <option value="">Selecione</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

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

export default ProductTable;
