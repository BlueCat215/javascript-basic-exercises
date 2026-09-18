import api from "../../../api/clients/httpClient";

const statsService = {
  getProductCount: () =>
    api.get("/products", { params: { page: 1, pageSize: 1 } }),
  getAllOrders: () => api.get("/orders"),
};

export default statsService;
