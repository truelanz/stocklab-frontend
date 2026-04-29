import api from "./api";

export const getClients = (page = 0, size = 20, search = "") => {
  return api.get("/clients", {
    params: { page, size, search },
  });
};

export const getClientById = (id) => api.get(`/clients/${id}`);
export const deleteClient = (id) => api.delete(`/clients/${id}`);

/**
 * O Spring Boot com @RequestPart("client") espera que a parte "client"
 * tenha Content-Type: application/json.
 * Quando usamos JSON.stringify() diretamente no FormData, o Axios envia
 * como application/octet-stream, causando o erro 500.
 * A solução é empacotar o JSON em um Blob com type "application/json".
 */
export const insertClient = (client, imageFile) => {
  const formData = new FormData();

  //Blob garante que o Spring receba Content-Type: application/json na parte "client"
  formData.append(
    "client",
    new Blob([JSON.stringify(client)], { type: "application/json" })
  );

  if (imageFile) {
    formData.append("photo", imageFile);
  }

  // Não setar Content-Type manualmente — o browser define o boundary correto
  return api.post("/clients", formData);
};

export const updateClient = (id, client, imageFile) => {
  const formData = new FormData();

  //Blob garante que o Spring receba Content-Type: application/json na parte "client"T
  formData.append(
    "client",
    new Blob([JSON.stringify(client)], { type: "application/json" })
  );

  if (imageFile) {
    formData.append("photo", imageFile);
  }

  return api.put(`/clients/${id}`, formData);
};