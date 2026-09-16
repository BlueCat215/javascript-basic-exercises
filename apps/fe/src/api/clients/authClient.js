import axios from "axios";

const authClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: { "Content-Type": "application/json" },
});

authClient.interceptors.response.use(
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

export default authClient;
