import api from "./api";

// page = número da página (0-based)
// size = quantidade por página
// search = string de pesquisa (opcional)
export const getProducts = (page = 0, size = 5, search = "") => {
  return api.get("/products", {
    params: { page, size, search },
  });
};
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (product) => api.post("/products", product);
export const updateProduct = (id, product) => api.put(`/products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
