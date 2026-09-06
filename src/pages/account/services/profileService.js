import api from "../../../api/clients/httpClient";

const profileService = {
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),
};

export default profileService;
