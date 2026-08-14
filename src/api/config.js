import axios from "axios";

// 1. Tạo một instance của Axios
const api = axios.create({
  baseURL: "https://fakestoreapi.com",
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ==========================================
// 2. AXIOS REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==========================================
// 3. AXIOS RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(
  (response) => response.data,

  async (error) => {
    const originalRequest = error.config;

    // --- XỬ LÝ LỖI 401: TOKEN HẾT HẠN ---
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest); // Chạy lại request cũ với token mới
          })
          .catch((err) => Promise.reject(err));
      }

      // Đánh dấu bắt đầu Refresh Token
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Fake: không tồn tại endpoint
        const res = await axios.post(
          "https://fakestoreapi.com/auth/refresh-token",
          { refreshToken },
        );

        const { newAccessToken } = res.data;

        // Ghi đè token mới vào bộ nhớ
        localStorage.setItem("accessToken", newAccessToken);

        // Phát hành token mới cho toàn bộ các request đang nằm trong hàng đợi
        processQueue(null, newAccessToken);

        // Chạy lại chính request hiện tại
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Nếu Refresh Token cũng hỏng -> Xóa sạch và Logout
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // --- QUẢN LÝ CÁC LỖI TOÀN CỤC KHÁC ---
    if (error.response) {
      switch (error.response.status) {
        case 403:
          console.error(
            "Bạn không có quyền truy cập vào tài nguyên này! (403)",
          );
          // Có thể chuyển hướng về trang /403-forbidden nếu cần
          break;
        case 500:
          console.error(
            "Lỗi hệ thống phía Máy chủ! Vui lòng thử lại sau. (500)",
          );
          break;
        default:
          console.error(`Lỗi hệ thống: ${error.response.statusText}`);
      }
    } else {
      // Trường hợp không có error.response (Mất mạng, Server sập hoàn toàn)
      console.error("Không thể kết nối Internet hoặc Server không phản hồi!");
    }

    return Promise.reject(error);
  },
);

export default api;
