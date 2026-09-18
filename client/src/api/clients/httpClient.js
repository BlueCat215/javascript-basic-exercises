import axios from "axios";
import { attachRequestInterceptor } from "../interceptors/requestInterceptor";
import { attachResponseInterceptor } from "../interceptors/responseInterceptor";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

attachRequestInterceptor(httpClient);
attachResponseInterceptor(httpClient);

export default httpClient;
