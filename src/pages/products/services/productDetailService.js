import api from "../../../api/clients/httpClient";

const productDetailService = {
  getById: (id) => api.get(`/products/${id}`),
};

export default productDetailService;
