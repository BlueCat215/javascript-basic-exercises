## Bản chất của Hydration (Nạp dữ liệu)

- Khái niệm: Là quá trình Zustand bốc mảng items cũ từ bộ nhớ cứng LocalStorage nạp ngược trở lại vào Store khi người dùng vừa F5/Reload lại trang.
- Xung đột SSR: Tại giây đầu tiên, Server render giao diện trống (vì Server không có LocalStorage). Client cần dùng biến _hasHydrated để ép giao diện đợi Zustand nạp xong dữ liệu trình duyệt, né hoàn toàn lỗi đỏ lệch giao diện (Hydration Mismatch).

---

## Tuyệt đối không gọi set() bừa bãi trong onRehydrateStorage

- Lỗi cũ: Gọi state.setHasHydrated(false/true) hoặc một action state.syncTotals() chứa lệnh set() ngay lúc Store đang kích hoạt nạp dữ liệu.
- Hậu quả: Kích nổ vòng lặp vô hạn. Lệnh set() ép Store thay đổi trạng thái ──► Kích hoạt lại Rehydrate ──► Lại gọi set() ──► Sập ứng dụng.

## Giải pháp ghi dịch (Mutate) trực tiếp

- Viết code gán trực tiếp thuộc tính state.totalItems = ... mà không qua màng lọc set() của Zustand sẽ không thông báo re-render cho Component.
- Lý do chạy được: Do có một lệnh set() chính thống của biến khác vô tình chạy ngay sau gánh dữ liệu đi theo (Cơ chế merge nội bộ). Đây là một tính năng "may rủi", hệ thống sẽ âm thầm gãy (silent bug) nếu thư viện cập nhật phiên bản.

## Sử dụng API lõi store.setState

- Zustand cung cấp tham số store (Store API gốc) ở tầng ngoài cùng của hàm onRehydrateStorage(store).
