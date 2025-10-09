import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";

function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(response => {
        console.log("Categorias do backend:", response.data);
        // se for paginado, use response.data.content
        setCategories(response.data.content || response.data);
      })
      .catch(err => console.error(err));
}, []);

  return (
    <div>
      <h1>Categorias</h1>
      <ul>
        {categories.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  );
}

export default Category;
