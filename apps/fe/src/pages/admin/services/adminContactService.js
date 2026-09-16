import api from "../../../api/clients/httpClient";

const adminContactService = {
  getAll: () => api.get("/contact-messages"),
  markRead: (id, isRead = true) =>
    api.patch(`/contact-messages/${id}/read`, { isRead }),
  remove: (id) => api.delete(`/contact-messages/${id}`),
};

export default adminContactService;
