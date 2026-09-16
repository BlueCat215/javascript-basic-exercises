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

      if (originalRequest.url?.includes("/auth/refresh-token")) {
        useAuthStore.getState().clearAuth();
        localStorage.removeItem("accessToken");

        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }

      // --- xử lí lỗi 401 cho các API thông thường ---
      if (error.response?.status === 401 && !originalRequest._retry) {
        const hasToken =
          !!localStorage.getItem("accessToken") ||
          !!localStorage.getItem("refreshToken");
        if (!hasToken) {
          return Promise.reject(error);
        }

        if (isRefreshing()) {
          return enqueueFailedRequest()
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return client(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        setIsRefreshing(true);

        try {
          const newAccessToken = await refreshAccessToken();

          localStorage.setItem("accessToken", newAccessToken);
          processQueue(null, newAccessToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          useAuthStore.getState().clearAuth();
          localStorage.removeItem("accessToken");

          if (window.location.pathname !== "/login") {
            window.location.replace("/login");
          }
          return Promise.reject(refreshError);
        } finally {
          setIsRefreshing(false);
        }
      }

      // --- QUẢN LÝ CÁC LỖI TOÀN CỤC KHÁC ---
      if (error.response) {
        switch (error.response.status) {
          case 401:
            break;
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
