import api from "./api";

export const getCategoriesCombo = async (page = 0, size = 50) => {
  const response = await api.get("/categories", {
    params: { page, size },
  });

  return response.data.content || [];
};

// page = número da página (0-based), size = itens por página, search = filtro opcional
export const getCategories = async (page = 0, size = 10, search = "") => {
  const response = await api.get("/categories", {
    params: { page, size, search },
  });

  // Retorna objeto completo com content e totalPages
  return response.data;
};

export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post("/categories", data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);
