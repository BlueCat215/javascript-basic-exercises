import api from "../../../api/clients/httpClient";
const checkoutService = {
  createOrder: (payload) => api.post("/orders", payload),
};
export default checkoutService;
