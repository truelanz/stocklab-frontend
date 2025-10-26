import api from "./api"; // seu axios base configurado

export const getEmployees = async (page = 0, size = 10, search = "") => {
  const response = await api.get("/employees", {
    params: { page, size, search },
  });
  return response.data;
};

export const createEmployee = async (employee) => {
  const response = await api.post("/employees/new", employee);
  return response.data;
};

export const updateEmployee = async (id, employee) => {
  const response = await api.put(`/employees/${id}`, employee);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await api.delete(`/employees/${id}`);
  return response.data;
};
