import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productService";
import { getCategoriesCombo } from "../services/CategoryService";
import "./ProductInsert.css";

function ProductInsert() {
  const [name, setName] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("");
  const [productValue, setProductValue] = useState("");
  const [validity, setValidity] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  //Carrega categorias
  useEffect(() => {
  const loadCategories = async () => {
    try {
      const list = await getCategoriesCombo(); // já pega content no service
      console.log("Categorias carregadas:", list);
      setCategories(list);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };
    loadCategories();
    }, []);

  // 🔹 Salvar produto
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !productValue || !categoryId) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const newProduct = {
        name: name.trim(),
        currentQuantity: Number(currentQuantity) || 0,
        productValue: parseFloat(productValue),
        issuanceDate: new Date().toISOString(), // data/hora atual
        validity: validity || null,
        categoryId: Number(categoryId), // ✅ enviar direto como número
    };


    try {
        await createProduct(newProduct);
        alert("Produto criado com sucesso!");
        //navigate("/products");
        //limpar campos
        setName("");
        setCurrentQuantity("");
        setProductValue("");
        setValidity("");
        setCategoryId("");
    } catch (error) {
      console.error(
        "Erro ao criar produto:",
        error.response?.data || error.message
      );
      alert(
        "Erro ao criar produto. Verifique os campos e o console para detalhes."
      );
    }
  };

  return (
    <div className="product-insert-container">
      <h1>Adicionar Produto</h1>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Nome do Produto *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div className="form-group">
          <label>Quantidade Atual</label>
          <input
            type="number"
            value={currentQuantity}
            onChange={(e) => setCurrentQuantity(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Valor do Produto (R$) *</label>
          <input
            type="number"
            step="0.01"
            value={productValue}
            onChange={(e) => setProductValue(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Validade</label>
          <input
            type="date"
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Categoria *</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Selecione uma categoria</option>
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">
            Salvar
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/products")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductInsert;
