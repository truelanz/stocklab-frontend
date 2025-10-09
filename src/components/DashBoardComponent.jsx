import React, { useState } from "react";
import "./DashBoardComponent.css";
import kitImage from "../assets/kit-de-primeiros-socorros.png";

function DashboardComponent() {
  const [sections] = useState([
    "Produtos",
    "Serviços",
    "Relatórios",
    "Clientes",
    "Funcionários",
    "Configurações"
  ]);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Painel de Controle</h1>

      <div className="dashboard-grid">
        {sections.map((section) => (
          <div key={section} className="dashboard-card">
            <h2>{section}</h2>
            <img
              src={kitImage}
              alt="produtos"
              style={{ width: "150px", height: "150px", marginTop: "1rem" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardComponent;
