import api from "../../../api/clients/httpClient";
const contactService = { send: (data) => api.post("/contact-messages", data) };
export default contactService;
