# Mini E-commerce

Monorepo gộp từ 2 dự án gốc, quản lý bằng **pnpm workspace**:

- `apps/fe` — Frontend (React + Vite)
- `apps/be` — Backend (Express, mock API, dữ liệu lưu file JSON)

## Yêu cầu

- Node.js >= 18
- pnpm >= 8 (`npm install -g pnpm` nếu chưa có)

## Cài đặt lần đầu (bắt buộc, làm đúng thứ tự)

Sau khi `git clone` repo về máy, thực hiện bước sau **theo thứ tự** :

**Bước 1 — Tạo file `.env` cho client**

```bash
cp apps/fe/.env.example apps/fe/.env
```

Mở `apps/fe/.env` kiểm tra có (nếu `.env.example` để trống
thì tự thêm vào):

```
VITE_SERVER_URL=http://localhost:4000
```

**Bước 2 — Cài dependency cho toàn bộ workspace (thư mục root):**

```bash
pnpm install
```

## Chạy dự án

### Cách 1 — Chạy cả client và server cùng lúc (khuyên dùng)

```bash
pnpm dev
```

Chạy song song `apps/fe` (mặc định `http://localhost:5173`)
& `apps/be` (mặc định `http://localhost:4000`)

### Cách 2 — Chạy riêng từng phần (2 terminal)

```bash
pnpm dev:fe   # chỉ chạy client
pnpm dev:be   # chỉ chạy server
```

Sau khi chạy, mở `http://localhost:5173`, kiểm tra DevTools Console
không có lỗi đỏ nào.

## Cấu hình

- `apps/fe/.env` — `VITE_SERVER_URL` trỏ tới server (xem "Cài đặt lần
  đầu" ở trên, **bắt buộc phải có file này**, không có client sẽ gọi
  nhầm API và báo lỗi).
- `apps/be` — có thể tạo `.env` riêng để đổi `PORT`, `ACCESS_SECRET`,
  `REFRESH_SECRET` (xem `apps/be/src/config.js`). Không bắt buộc, có giá trị
  mặc định sẵn để chạy demo.

## Xử lý sự cố

- **Lỗi `categories.map is not a function` hoặc trang trắng khi mở client:**
  chưa tạo `apps/fe/.env` (xem lại bước 1 ở "Cài đặt lần đầu").
- **Lỗi `Cannot destructure property 'basename' of ... useContext(...)`:**
  thường là hệ quả của lỗi trên (một lỗi khác xảy ra trước đó khiến
  `ErrorBoundary` kích hoạt) — kiểm tra Console để tìm lỗi gốc thật sự
  thay vì lỗi `basename` hiển thị sau cùng.
- **`pnpm install` báo `ERR_PNPM_MODIFIED_DEPENDENCY` hoặc dependency lạ:**
  kho cache pnpm trên máy có thể bị hỏng (thường do phần mềm diệt virus
  can thiệp). Chạy `pnpm store prune` rồi `pnpm install` lại.

## Tài liệu API Backend

Xem chi tiết danh sách endpoint (`auth`, `products`, `users`, `carts`,
`orders`, `vouchers`, `favorites`, `contact-messages`, `articles`) tại
[`apps/be/README.md`](./apps/be/README.md).

## Cấu trúc thư mục

```
.
├── apps/
│   ├── fe/        # React + Vite app
│   └── be/        # Express mock API
├── pnpm-workspace.yaml
├── package.json   # scripts điều phối chạy cả 2 app
└── README.md
```
