import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import Category from "./pages/Category";

function App() {
  return (
    <Router>
      <div>
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
            <Route path="/categories" element={<Category />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  navbar: {
    background: "#282c34",
    padding: "10px",
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0,
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
  content: {
    padding: "20px",
  }
};

export default App;
