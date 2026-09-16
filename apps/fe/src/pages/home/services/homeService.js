import api from "../../../api/clients/httpClient";
const homeService = {
  getCategories: () => api.get("/products/categories"),
  getProductsByCategory: (category, limit = 8) =>
    api.get(`/products/category/${category}?limit=${limit}`),
  getProducts: (params) => api.get("/products", { params }),
  getRecommended: (tab, limit = 5) =>
    api.get("/products/recommended", { params: { tab, limit } }),
  getClearance: (limit = 5) =>
    api.get("/products/clearance", { params: { limit } }),
  getNewArrival: (tab, limit = 8) =>
    api.get("/products/new-arrival", { params: { tab, limit } }),
  getArticles: (limit = 5) => api.get("/articles", { params: { limit } }),
};

export default homeService;
