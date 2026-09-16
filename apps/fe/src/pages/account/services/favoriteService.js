import api from "../../../api/clients/httpClient";

const favoriteService = {
  getAll: () => api.get("/favorites"),
  add: (productId) => api.post("/favorites", { productId }),
  remove: (productId) => api.delete(`/favorites/${productId}`),
};

export default favoriteService;
