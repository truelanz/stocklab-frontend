import api from "./api";

// page = número da página (0-based)
// size = quantidade por página
// search = string de pesquisa (opcional)
export const getClients = (page = 0, size = 20, search = "") => {
  return api.get("/clients", {
    params: { page, size, search },
  });
};
export const getClientById = (id) => api.get(`/clients/${id}`);
export const createClient = (client) => api.post("/clients/new", client);
export const updateClient = (id, client) => api.put(`/clients/${id}`, client);
export const deleteClient = (id) => api.delete(`/clients/${id}`);
export const uploadClientImage = (id, image) => api.post(`/clients/upload`, image);
