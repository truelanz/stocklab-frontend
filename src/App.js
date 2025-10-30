import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProductInsert from "./pages/ProductInsert";
import CategoryInsert from "./pages/CategoryInsert";
import Category from "./pages/Category";
import Client from "./pages/Client";
import ClientInsert from "./pages/ClientInsert";
import Employee from "./pages/Employee";
import ServiceJob from "./pages/ServiceJob";
import ServiceJobInsert from "./pages/ServiceJobInsert";
import Report from "./pages/Report";
import Config from "./pages/Config";
import "./App.css";
import logo from "./assets/logo.png";

function App() {
  return (
    <Router>
      <div style={styles.container}>
        {/* Menu de navegação */}
        <nav style={styles.navbar}>
          <ul style={styles.menu}>
            <li><Link to="/"> <img style={styles.img} src={logo}></img></Link> </li>
            <li><Link style={styles.link} to="/">StockLab</Link></li>
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
            <Route path="/clients" element={<Client />} />
            <Route path="/clients/new" element={<ClientInsert />} />
            <Route path="/employees" element={<Employee />} /> 
            <Route path="/services" element={<ServiceJob />} />
            <Route path="/services/new" element={<ServiceJobInsert />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/configs" element={<Config />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <a href="https://github.com/truelanz" target="_blank" rel="noopener noreferrer"> <p>© {new Date().getFullYear()} StockLab </p> </a>
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
    fontSize: "20px",
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
  img: {
    height: "40px",
    width: "40px"
  }

};

export default App;
