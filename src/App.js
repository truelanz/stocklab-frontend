import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProductInsert from "./pages/ProductInsert";
import CategoryInsert from "./pages/CategoryInsert";
import Category from "./pages/Category";

function App() {
  return (
    <Router>
      <div style={styles.container}>
        {/* Menu de navegação */}
        <nav style={styles.navbar}>
          <ul style={styles.menu}>
            <li><Link style={styles.link} to="/">Dashboard</Link></li>
            <li><Link style={styles.link} to="/products">Produtos</Link></li>
            <li><Link style={styles.link} to="/categories">Categorias</Link></li>
          </ul>
        </nav>

        {/* Área de conteúdo */}
        <div style={styles.content}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Product />} />
            <Route path="/products/new" element={<ProductInsert />} />
            <Route path="/categories" element={<Category />} />
            <Route path="/categories/new" element={<CategoryInsert />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} StockLab — Desenvolvido por Alan</p>
        </footer>
      </div>
    </Router>
  );
}


const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  navbar: {
    backgroundColor: "#222",
    padding: "10px 0",
  },
  menu: {
    display: "flex",
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    margin: "0 20px",
    fontWeight: "bold",
  },
  content: {
    flex: 1, // 👈 mantém o footer sempre no final da tela
    padding: "20px",
    backgroundColor: "#1d1d1fff",
  },
  footer: {
    textAlign: "center",
    padding: "5px",
    backgroundColor: "#222",
    color: "#fff",
    fontSize: "12px",
  },
};

export default App;
