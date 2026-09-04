import api from "../../../api/clients/httpClient";
const homeService = {
  getCategories: () => api.get("/products/categories"),
  getProductsByCategory: (category, limit = 8) =>
    api.get(`/products/category/${category}?limit=${limit}`),
};

export default homeService;
