import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { getCategories } from "../services/CategoryService";
import api from "../services/api";
import ProductTable from "../components/ProductTable";
import CategoryTable from "../components/CategoryTable";
import "./Product.css";
import add2 from "../assets/add2.png";
import { useNavigate, Link, Router } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  //Navega entre páginas (Routes)
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const loadProducts = async () => {
    try {
      const response = await getProducts(page, size, search);
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const handleEdit = async (id) => {
    const newName = prompt("Novo nome do produto:");
    if (newName) {
      try {
        await api.put(`/products/${id}`, { name: newName });
        loadProducts();
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja realmente excluir este produto?")) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
      }
    }
  };

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleAddProduct = () => {
    navigate("/products/new");
  };
  const handleAddCategory = () => {
  navigate("/categories/new");
  };


  return (
    <div className="product-page">
      <h1>Produtos</h1>

      <div className="product-header">
        <div className="add-category-button" alt="Add Button" onClick={handleAddCategory}>
          <img src={add2}></img> <h2>Categorias</h2>
        </div>

        <div className="add-product-button" alt="Add Button" onClick={handleAddProduct}>
          <img src={add2}></img> <h2>Produtos</h2>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisar produto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      <ProductTable
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="pagination">
        <button className="btn-back" onClick={prevPage} disabled={page === 0}>
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button className="btn-next" onClick={nextPage} disabled={page >= totalPages - 1}>
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Product;
