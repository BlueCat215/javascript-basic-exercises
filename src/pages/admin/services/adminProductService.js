import api from "../../../api/clients/httpClient";

const adminProductService = {
  getAll: (params) => api.get("/products", { params }),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  bulkImport: (products) => api.post("/products/bulk", { products }),
};

export default adminProductService;
