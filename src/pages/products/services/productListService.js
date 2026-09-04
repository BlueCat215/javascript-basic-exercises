import api from "../../../api/clients/httpClient";

const productListService = {
  getProducts: (params) => api.get("/products", { params }),
};

export default productListService;
