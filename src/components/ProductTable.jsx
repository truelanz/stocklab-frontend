import React from "react";
import "./ProductTable.css";

function ProductTable({ products, onEdit, onDelete }) {
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
                <td className="actions">
                  <button className="edit-btn" onClick={() => onEdit(p.id)}>
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
              <td colSpan="5" className="no-data">
                Nenhum produto encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
