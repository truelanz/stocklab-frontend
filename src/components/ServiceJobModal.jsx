import React, { useEffect, useState } from "react";
import "./ServiceJobModal.css";
import { updateServiceJob, finishServiceJob } from "../services/serviceJobService";
import api from "../services/api";

function ServiceJobModal({ service, closeModal, refresh }) {
  const [form, setForm] = useState({ ...service });
  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    // carregar listas de select (employees, clients, products)
    const loadLists = async () => {
      try {
        const [empResp, cliResp, prodResp] = await Promise.all([
          api.get("/employees?page=0&size=200"),
          api.get("/clients?page=0&size=200"),
          api.get("/products?page=0&size=500")
        ]);
        setEmployees(empResp.data.content || empResp.data);
        setClients(cliResp.data.content || cliResp.data);
        setProductsList(prodResp.data.content || prodResp.data);
      } catch (err) {
        console.error("Erro ao carregar listas:", err);
      }
    };
    loadLists();
  }, []);

  useEffect(() => {
    setForm({ ...service });
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Produtos: adiciona linha vazia
  const addProductRow = () => {
    setForm(prev => ({ ...prev, products: [...(prev.products || []), { productId: "", quantityUsed: 1 }] }));
  };

  const updateProductRow = (index, field, value) => {
    const newProducts = (form.products || []).map((p, i) => i === index ? { ...p, [field]: field === "quantityUsed" ? Number(value) : value } : p);
    setForm(prev => ({ ...prev, products: newProducts }));
  };

  const removeProductRow = (index) => {
    const newProducts = (form.products || []).filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, products: newProducts }));
  };

  const handleSubmit = async () => {
    try {
      // preparar payload conforme backend espera
      const payload = {
        ...form,
        employee: form.employee?.id ? { id: Number(form.employee.id) } : form.employee,
        client: form.client?.id ? { id: Number(form.client.id) } : form.client,
        // serviceValue e totalValue devem ser números
        serviceValue: Number(form.serviceValue || 0),
        totalValue: Number(form.totalValue || 0)
      };

      const res = await updateServiceJob(form.id, payload);
      alert("Serviço atualizado com sucesso!");
      refresh();
      closeModal();
    } catch (err) {
      console.error("Erro ao atualizar serviço:", err);
      if (err.response?.data?.errors) {
        const msgs = err.response.data.errors.map(e => `• ${e.message}`).join("\n");
        alert("Erro de validação:\n" + msgs);
      } else alert("Erro ao atualizar. Veja console.");
    }
  };

  const handleFinish = async () => {
    if (!window.confirm("Marcar serviço como finalizado?")) return;
    try {
      await finishServiceJob(form.id);
      alert("Serviço finalizado com sucesso!");
      refresh();
      closeModal();
    } catch (err) {
      console.error("Erro ao finalizar serviço:", err);
      alert("Erro ao finalizar serviço. Veja console.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h2>Editar Serviço #{form.id}</h2>

        <label>Nome:</label>
        <input name="name" value={form.name || ""} onChange={handleChange} />

        <label>Descrição:</label>
        <textarea className="description" name="description" value={form.description || ""} onChange={handleChange}/>

        <div className="grid-2">
          <div>
            <label>Data Início:</label>
            <input type="date" name="initDate" value={form.initDate || ""} onChange={handleChange} />
          </div>
          <div>
            <label>Hora Início:</label>
            <input type="time" name="initTime" value={form.initTime || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Data Fim:</label>
            <input type="date" name="finalDate" value={form.finalDate || ""} onChange={handleChange} />
          </div>
          <div>
            <label>Hora Fim:</label>
            <input type="time" name="finalTime" value={form.finalTime || ""} onChange={handleChange} />
          </div>
        </div>

        <div className="grid-3">
          <div>
            <label>Valor do Serviço:</label>
            <input type="number" step="0.01" name="serviceValue" value={form.serviceValue || ""} onChange={handleChange} />
          </div>
          <div>
            <label>Valor Total:</label>
            <input type="number" step="0.01" name="totalValue" value={form.totalValue || ""} onChange={handleChange} />
          </div>
          <div>
            <label>Status:</label>
            <select name="status" value={form.status || "IN_PROGRESS"} onChange={handleChange}>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="FINISHED">FINISHED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Funcionário:</label>
            <select
              name="employee"
              value={form.employee?.id ?? form.employee?.id ?? ""}
              onChange={(e) => setForm(prev => ({ ...prev, employee: { id: Number(e.target.value) } }))}
            >
              <option value="">Selecione</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>

          <div>
            <label>Cliente:</label>
            <select
              name="client"
              value={form.client?.id ?? form.client?.id ?? ""}
              onChange={(e) => setForm(prev => ({ ...prev, client: { id: Number(e.target.value) } }))}
            >
              <option value="">Selecione</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="products-rows">
          <h3>Produtos utilizados</h3>
          {(form.products || []).map((p, idx) => (
            <div className="product-row" key={idx}>
              <select value={p.productId || ""} onChange={(e) => updateProductRow(idx, "productId", Number(e.target.value))}>
                <option value="">Selecione produto</option>
                {productsList.map(prod => <option key={prod.id} value={prod.id}>{prod.name}</option>)}
              </select>
              <input type="number" min="1" value={p.quantityUsed || 1} onChange={(e) => updateProductRow(idx, "quantityUsed", Number(e.target.value))} />
              <button type="button" className="btn-cancel" onClick={() => removeProductRow(idx)}>Remover</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <button type="button" className="btn-save" onClick={addProductRow}>+ Adicionar produto</button>
        </div>

        <div className="modal-buttons" style={{ marginTop: 12 }}>
          <button className="btn-save" onClick={handleSubmit}>Salvar</button>
          <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
          <button className="btn-save" onClick={handleFinish}>Marcar como finalizado</button>
        </div>
      </div>
    </div>
  );
}

export default ServiceJobModal;
