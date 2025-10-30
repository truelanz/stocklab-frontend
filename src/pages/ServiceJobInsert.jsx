import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceJobInsert.css";
import { insertServiceJob } from "../services/serviceJobService";
import api from "../services/api";

function ServiceJobInsert() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    initDate: "",
    initTime: "",
    finalDate: "",
    finalTime: "",
    serviceValue: 0,
    totalValue: 0,
    status: "IN_PROGRESS",
    employee: null,
    client: null,
    products: []
  });

  const [employees, setEmployees] = useState([]);
  const [clients, setClients] = useState([]);
  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    // preencher com data/hora atual por padrão
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, "0");
    setForm(prev => ({
      ...prev,
      initDate: now.toISOString().slice(0,10),
      initTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`
    }));

    // carregar selects
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // montar payload
      const payload = {
        ...form,
        employee: form.employee ? { id: Number(form.employee) } : null,
        client: form.client ? { id: Number(form.client) } : null,
        serviceValue: Number(form.serviceValue || 0),
        totalValue: Number(form.totalValue || 0)
      };

      const res = await insertServiceJob(payload);
      alert("Serviço criado com sucesso!");
      navigate("/services");
    } catch (err) {
      console.error("Erro ao criar serviço:", err);
      if (err.response?.data?.errors) {
        const msgs = err.response.data.errors.map(e => `• ${e.message}`).join("\n");
        alert("Erro de validação:\n" + msgs);
      } else alert("Erro ao criar serviço. Veja console.");
    }
  };

  return (
    <div className="servicejob-insert">
      <h2>Novo Serviço</h2>
      <form onSubmit={handleSubmit} className="service-form">
        <label>Nome:</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Descrição:</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <div className="grid-2">
          <div>
            <label>Data Início:</label>
            <input type="date" name="initDate" value={form.initDate} onChange={handleChange} />
          </div>
          <div>
            <label>Hora Início:</label>
            <input type="time" name="initTime" value={form.initTime} onChange={handleChange} />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Data Fim:</label>
            <input type="date" name="finalDate" value={form.finalDate} onChange={handleChange} />
          </div>
          <div>
            <label>Hora Fim:</label>
            <input type="time" name="finalTime" value={form.finalTime} onChange={handleChange} />
          </div>
        </div>

        <div className="grid-3">
          <div>
            <label>Valor Serviço:</label>
            <input type="number" name="serviceValue" step="0.01" value={form.serviceValue} onChange={handleChange} />
          </div>
          <div>
            <label>Valor Total:</label>
            <input type="number" name="totalValue" step="0.01" value={form.totalValue} onChange={handleChange} />
          </div>
          <div>
            <label>Status:</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="FINISHED">FINISHED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Funcionário:</label>
            <select name="employee" value={form.employee || ""} onChange={handleChange}>
              <option value="">Selecione</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>

          <div>
            <label>Cliente:</label>
            <select name="client" value={form.client || ""} onChange={handleChange}>
              <option value="">Selecione</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="products-rows">
          <h3>Produtos utilizados:</h3>
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

        <div className="form-actions" style={{ marginTop: 12 }}>
          <button type="submit" className="btn-save">Criar</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/services")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}

export default ServiceJobInsert;
