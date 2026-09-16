# Mini E-commerce

Monorepo gộp từ 2 dự án gốc, quản lý bằng **pnpm workspace**:

- `apps/fe` — Frontend (React + Vite)
- `apps/be` — Backend (Express, mock API, dữ liệu lưu file JSON)

## Yêu cầu

- Node.js >= 18
- pnpm >= 8 (`npm install -g pnpm` nếu chưa có)

## Cài đặt

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

## Cấu hình

- `apps/fe/.env` — `VITE_SERVER_URL` trỏ tới server, mặc định:
  ```
  VITE_SERVER_URL=http://localhost:4000
  ```
- `apps/be` — có thể tạo `.env` riêng để đổi `PORT`, `ACCESS_SECRET`,
  `REFRESH_SECRET` (xem `apps/be/src/config.js`). Không bắt buộc, có giá trị
  mặc định sẵn để chạy demo.

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
