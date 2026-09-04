// src/pages/cart/services/cartService.js
import api from "../../../api/clients/httpClient";

const cartService = {
  getActiveCart: () => api.get("/carts/active"),

  addItem: (productId, quantity = 1) =>
    api.post("/carts/active/items", { productId, quantity }),

  updateItemQuantity: (productId, quantity) =>
    api.patch(`/carts/active/items/${productId}`, { quantity }),

  removeItem: (productId) => api.delete(`/carts/active/items/${productId}`),

  clearCart: () => api.delete("/carts/active"),
};

export default cartService;
