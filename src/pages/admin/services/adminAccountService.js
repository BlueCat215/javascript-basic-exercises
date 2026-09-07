import api from "../../../api/clients/httpClient";

const adminAccountService = {
  getAll: () => api.get("/users"),
  update: (id, data) => api.patch(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export default adminAccountService;
