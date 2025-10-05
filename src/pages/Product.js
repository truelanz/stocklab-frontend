import React, { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(20);
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
    <div style={{ padding: "2rem" }}>
      <h1>Produtos</h1>

      {/* Barra de pesquisa */}
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
          padding: "0.5rem",
          width: "300px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Grid de produtos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={p.imgProduct}
              alt={p.name}
              style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }}
            />
            <h3 style={{ margin: "0.5rem 0" }}>{p.name}</h3>
            <p>Quantidade: {p.currentQuantity}</p>
            <p>Valor: R$ {p.productValue}</p>
          </div>
        ))}
      </div>

      {/* Paginação */}
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button onClick={prevPage} disabled={page === 0} style={{ marginRight: "1rem" }}>
          Anterior
        </button>
        <span>
          Página {page + 1} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={page >= totalPages - 1} style={{ marginLeft: "1rem" }}>
          Próximo
        </button>
      </div>
    </div>
  );
}

export default Products;
