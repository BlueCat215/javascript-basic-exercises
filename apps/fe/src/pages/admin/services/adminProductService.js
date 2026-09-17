import api from "../../../api/clients/httpClient";

const adminProductService = {
  getAll: (params) => api.get("/products", { params }),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  remove: (id) => api.delete(`/products/${id}`),
  bulkImport: (products) => api.post("/products/bulk", { products }),
  getCategories: () => api.get("/products/categories"),
  uploadImages: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post("/products/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default adminProductService;
