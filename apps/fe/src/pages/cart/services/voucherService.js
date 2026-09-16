import api from "../../../api/clients/httpClient";

const voucherService = {
  apply: (code) => api.post("/vouchers/apply", { code }),
};

export default voucherService;
