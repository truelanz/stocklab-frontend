import api from "./api";

export const uploadClientImage = (clientId, image) => {
    const formData = new FormData();
    formData.append("file", image);

    return api.post(`/upload/image/${clientId}`, formData);
};

export const updateClientImage = (id) => api.update(`/clients/${id}`);