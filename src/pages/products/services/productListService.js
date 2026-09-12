import api from "../../../api/clients/httpClient";

const productListService = {
  getProducts: (params) => api.get("/products", { params }),
  getBrands: () => api.get("/products/brands"),
};

export default productListService;
