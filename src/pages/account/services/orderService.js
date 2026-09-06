import api from "../../../api/clients/httpClient";
const orderService = { getMine: (userId) => api.get(`/orders/user/${userId}`) };
export default orderService;
