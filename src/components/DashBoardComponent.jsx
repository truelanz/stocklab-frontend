import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DashBoardComponent.css";
import produtosImg from "../assets/produtos.png";
import servicosImg from "../assets/servicos.png";
import relatoriosImg from "../assets/relatorios.png";
import clientesImg from "../assets/clientes.png";
import funcionariosImg from "../assets/funcionarios.png";
import configuracoesImg from "../assets/configuracoes.png";

function DashboardComponent() {
  const sections = [
    { name: "Produtos", img: produtosImg,  path: "/products" },
    { name: "Serviços", img: servicosImg },
    { name: "Relatórios", img: relatoriosImg },
    { name: "Clientes", img: clientesImg },
    { name: "Funcionários", img: funcionariosImg },
    { name: "Configurações", img: configuracoesImg },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Painel de Controle</h1>

      <div className="dashboard-grid">
        {sections.map((section) =>
          section.path ? (
            <Link key={section.name} to={section.path} className="dashboard-card-link">
              <div className="dashboard-card">
                <img src={section.img} alt={section.name} className="dashboard-icon" />
                <h2 >{section.name}</h2>
              </div>
            </Link>
          ) : (
            <div key={section.name} className="dashboard-card">
              <img src={section.img} alt={section.name} className="dashboard-icon" />
              <h2>{section.name}</h2>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default DashboardComponent;
