import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
});

authApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error(
        `Lỗi Auth API: ${error.response.status} - ${error.response.data?.message}`,
      );
    } else {
      console.error("Không thể kết nối tới Auth Server!");
    }
    return Promise.reject(error);
  },
);
export default authApi;
