import api from "./api";

// page e size -> params de paginação
export const getServiceJobs = async (page = 0, size = 10, sort = "") => {
  const response = await api.get("/services", { params: { page, size, sort } });
  return response.data;
};

export const insertServiceJob = async (dto) => {
  const response = await api.post("/services", dto);
  return response.data;
};

export const updateServiceJob = async (id, dto) => {
  const response = await api.put(`/services/${id}`, dto);
  return response.data;
};

export const deleteServiceJob = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

export const finishServiceJob = async (id) => {
  const response = await api.put(`/services/${id}/finish`);
  return response.data;
};

// busca dinâmica com JSON via POST
export const searchServiceJobs = async (filters = {}, page = 0, size = 10) => {
  const response = await api.post("/services/search?page=" + page + "&size=" + size, filters);
  return response.data;
};
