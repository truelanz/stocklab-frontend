import React, { useEffect, useState } from "react";
import "./Product.css";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(24);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");

  const loadProducts = () => {
    getProducts(page, size, search)
      .then((response) => {
        setProducts(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadProducts();
  }, [page, search]);

  const nextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  return (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>Produtos</h1>

    {/* Barra de pesquisa */}
    <div className="search-bar">
      <input
        type="text"
        placeholder="Pesquisar produto..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        style={{
          marginBottom: "1.5rem",
          padding: "1.2rem",
          width: "50%",
          borderRadius: "15px",
        }}
      />
     </div>
     
      {/* Grid de produtos */}
       <div className="product-page">
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.imgProduct}
                alt={p.name}
                className="product-image"
              />
              <h3>{p.id} {p.name}</h3>
              <p>Quantidade: {p.currentQuantity}</p>
              <p>Valor: R$ {p.productValue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Paginação */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button className="btn-back" onClick={prevPage} disabled={page === 0} >
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button className="btn-next" onClick={nextPage} disabled={page >= totalPages - 1} >
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Products;
