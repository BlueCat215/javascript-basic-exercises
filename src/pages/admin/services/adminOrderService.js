import api from "../../../api/clients/httpClient";

const adminOrderService = {
  getAll: () => api.get("/orders"),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default adminOrderService;
