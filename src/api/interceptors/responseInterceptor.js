import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import { refreshAccessToken } from "./refresh/refreshToken";
import {
  isRefreshing,
  setIsRefreshing,
  enqueueFailedRequest,
  processQueue,
} from "./refresh/refreshQueue";

export const attachResponseInterceptor = (client) => {
  client.interceptors.response.use(
    (response) => response.data,

    async (error) => {
      const originalRequest = error.config;

      // --- xử lí lỗi 401: TOKEN HẾT HẠN ---
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing()) {
          return enqueueFailedRequest()
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest); // Chạy lại request cũ với token mới
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true; // đánh dấu đã thử lại
        setIsRefreshing(true);

        try {
          const newAccessToken = await refreshAccessToken();

          // Ghi đè token mới vào bộ nhớ
          localStorage.setItem("accessToken", newAccessToken);
          processQueue(null, newAccessToken);

          // Chạy lại chính request hiện tại
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          // Nếu Refresh Token cũng hỏng -> xóa sạch và Logout
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          window.location.href = "/login";
          return Promise.reject(refreshError);
        } finally {
          setIsRefreshing(false);
        }
      }

      // --- QUẢN LÝ CÁC LỖI TOÀN CỤC KHÁC ---
      if (error.response) {
        switch (error.response.status) {
          case 403:
            toast.error("Bạn không có quyền truy cập vào tài nguyên này!");
            break;
          case 500:
            toast.error("Lỗi hệ thống Máy chủ! Vui lòng thử lại sau.");
            break;
          default:
            toast.error(`Lỗi: ${error.response.statusText}`);
        }
      } else {
        toast.error("Không thể kết nối Internet hoặc Server không phản hồi!");
      }

      return Promise.reject(error);
    },
  );
};
