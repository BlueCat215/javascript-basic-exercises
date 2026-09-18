# Mock Store API

Server Node.js + Express chạy local, dùng để học tập / làm backend giả lập cho các dự án frontend (ecommerce, quản lý sản phẩm...). Dữ liệu được lưu trong các file JSON tại `data/*.json`, mỗi lần CRUD sẽ ghi thẳng vào các file này nên dữ liệu **có persist** giữa các lần request (nhưng sẽ mất nếu bạn xoá file hoặc revert bằng git).

## Cài đặt & chạy

Project dùng **pnpm** (có `pnpm-lock.yaml`, không có `package-lock.json`).

```bash
pnpm install
pnpm dev
# hoặc
pnpm start
```

Server chạy ở `http://localhost:4000` (đổi qua biến môi trường `PORT`).

Có thể tạo file `.env` ở gốc project để cấu hình:

```
PORT=4000
ACCESS_SECRET=access-secret-demo
REFRESH_SECRET=refresh-secret-demo
```

## Cấu trúc thư mục

```
server.js              # Khởi tạo app, đăng ký route, xử lý lỗi
src/
  config.js             # Đọc biến môi trường (PORT, secret, thời hạn token)
  db.js                 # Lớp JsonCollection: đọc/ghi CRUD trên file JSON
  middleware/auth.js     # authenticateToken, authorizeRoles
  routes/                # Từng route ứng với 1 resource
data/                   # Dữ liệu lưu dạng JSON (đóng vai trò "database")
```

## Auth

| Method | Endpoint              | Mô tả                                                     | Quyền           |
| ------ | --------------------- | --------------------------------------------------------- | --------------- |
| POST   | `/auth/login`         | Đăng nhập, trả về `accessToken` + `refreshToken` + `user` | public          |
| POST   | `/auth/refresh-token` | Lấy `accessToken` mới từ `refreshToken`                   | public          |
| POST   | `/auth/logout`        | Vô hiệu hoá `refreshToken`                                | public          |
| GET    | `/auth/me`            | Lấy thông tin user hiện tại                               | cần accessToken |

- Access token hết hạn sau **15 phút**, refresh token hết hạn sau **7 ngày** (cấu hình trong `src/config.js`).
- Danh sách refresh token hợp lệ lưu trong bộ nhớ (RAM) — mất khi restart server.
- Gửi token qua header: `Authorization: Bearer <accessToken>`.
- Tài khoản có `isLocked: true` sẽ không đăng nhập được (403).

## Products

| Method | Endpoint                           | Mô tả                                                                     | Quyền  |
| ------ | ---------------------------------- | ------------------------------------------------------------------------- | ------ |
| GET    | `/products`                        | Danh sách sản phẩm, hỗ trợ tìm kiếm/lọc/sắp xếp/phân trang (xem bên dưới) | public |
| GET    | `/products/categories`             | Danh sách category                                                        | public |
| GET    | `/products/category/:categoryName` | Lọc theo category                                                         | public |
| GET    | `/products/recommended`            | Sản phẩm đề xuất theo `?tab=best-seller\|top-rated\|<category>&limit=`    | public |
| GET    | `/products/clearance`              | Sản phẩm đang giảm giá, sắp theo % giảm, `?limit=`                        | public |
| GET    | `/products/new-arrival`            | Sản phẩm mới, `?tab=featured\|<category>&limit=`                          | public |
| GET    | `/products/brands`                 | Danh sách thương hiệu kèm số lượng sản phẩm                               | public |
| GET    | `/products/:id`                    | Lấy 1 sản phẩm                                                            | public |
| POST   | `/products`                        | Tạo sản phẩm mới                                                          | admin  |
| POST   | `/products/bulk`                   | Import nhiều sản phẩm cùng lúc (bỏ qua dòng thiếu title/price)            | admin  |
| PUT    | `/products/:id`                    | Cập nhật toàn bộ                                                          | admin  |
| PATCH  | `/products/:id`                    | Cập nhật 1 phần                                                           | admin  |
| DELETE | `/products/:id`                    | Xoá sản phẩm                                                              | admin  |

Query hỗ trợ cho `GET /products`:

- `q` — tìm theo tên (không phân biệt hoa/thường)
- `category`, `brand` (nhiều brand cách nhau bởi dấu phẩy), `minPrice`, `maxPrice`, `minRating`
- `isNew=true`, `isBestSeller=true`, `onSale=true`
- `sort=price_asc|price_desc|newest|discount_desc|rating_desc`
- `page`, `pageSize` (mặc định `page=1`, `pageSize=12`)
- Kết quả trả về dạng `{ items, total, page, pageSize, totalPages }`

## Users

| Method | Endpoint              | Mô tả                                                | Quyền                |
| ------ | --------------------- | ---------------------------------------------------- | -------------------- |
| GET    | `/users`              | Lấy tất cả user (ẩn password)                        | admin                |
| GET    | `/users/:id`          | Lấy 1 user (ẩn password)                             | chính chủ hoặc admin |
| POST   | `/users`              | Đăng ký user mới (role mặc định `customer`)          | public               |
| POST   | `/users/admin-create` | Admin tạo user với role tuỳ ý                        | admin                |
| PUT    | `/users/:id`          | Cập nhật toàn bộ                                     | chính chủ hoặc admin |
| PATCH  | `/users/:id`          | Cập nhật 1 phần                                      | chính chủ hoặc admin |
| PATCH  | `/users/:id/password` | Đổi mật khẩu (cần `currentPassword` + `newPassword`) | chính chủ hoặc admin |
| DELETE | `/users/:id`          | Xoá user                                             | admin                |

Lưu ý: chỉ admin mới có thể gán `role: "admin"` cho user khác qua PUT/PATCH; user thường tự đăng ký qua `POST /users` luôn bị ép về `role: "customer"` dù có gửi field `role` lên.

## Carts

Giỏ hàng "đang dùng" của mỗi user được quản lý qua nhóm endpoint `/carts/active` (khuyên dùng cho frontend); các endpoint CRUD theo `id` bên dưới phù hợp hơn cho việc quản trị/xem dữ liệu thô.

| Method | Endpoint                         | Mô tả                                                                      | Quyền         |
| ------ | -------------------------------- | -------------------------------------------------------------------------- | ------------- |
| GET    | `/carts/active`                  | Lấy (hoặc tự tạo) giỏ hàng active của user hiện tại, kèm chi tiết sản phẩm | cần đăng nhập |
| POST   | `/carts/active/items`            | Thêm sản phẩm vào giỏ active (`productId`, `quantity`)                     | cần đăng nhập |
| PATCH  | `/carts/active/items/:productId` | Cập nhật số lượng 1 sản phẩm trong giỏ active                              | cần đăng nhập |
| DELETE | `/carts/active/items/:productId` | Xoá 1 sản phẩm khỏi giỏ active                                             | cần đăng nhập |
| DELETE | `/carts/active`                  | Làm trống giỏ active                                                       | cần đăng nhập |
| GET    | `/carts`                         | Lấy tất cả giỏ hàng (hỗ trợ `?limit=&sort=asc/desc`)                       | public        |
| GET    | `/carts/user/:userId`            | Lấy tất cả giỏ hàng theo userId                                            | public        |
| GET    | `/carts/:id`                     | Lấy 1 giỏ hàng theo id                                                     | public        |
| POST   | `/carts`                         | Tạo giỏ hàng mới                                                           | cần đăng nhập |
| PUT    | `/carts/:id`                     | Cập nhật toàn bộ                                                           | cần đăng nhập |
| PATCH  | `/carts/:id`                     | Cập nhật 1 phần                                                            | cần đăng nhập |
| DELETE | `/carts/:id`                     | Xoá giỏ hàng                                                               | cần đăng nhập |

## Orders

| Method | Endpoint               | Mô tả                                                                                                                | Quyền                |
| ------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------- |
| POST   | `/orders`              | Tạo đơn hàng từ giỏ hàng active hiện tại (`shippingInfo`, `paymentMethod`), sau đó đóng giỏ cũ và tạo giỏ active mới | cần đăng nhập        |
| GET    | `/orders/user/:userId` | Lấy lịch sử đơn hàng của user                                                                                        | chính chủ hoặc admin |
| GET    | `/orders`              | Lấy toàn bộ đơn hàng                                                                                                 | admin                |
| PATCH  | `/orders/:id/status`   | Cập nhật trạng thái đơn hàng (`status`)                                                                              | admin                |

## Vouchers

| Method | Endpoint          | Mô tả                                   | Quyền  |
| ------ | ----------------- | --------------------------------------- | ------ |
| POST   | `/vouchers/apply` | Kiểm tra & áp dụng mã giảm giá (`code`) | public |

Voucher không hợp lệ khi: không tồn tại, `isActive: false`, hoặc đã quá `expiryDate`.

## Favorites

| Method | Endpoint                | Mô tả                                                              | Quyền         |
| ------ | ----------------------- | ------------------------------------------------------------------ | ------------- |
| GET    | `/favorites`            | Lấy danh sách yêu thích của user hiện tại (kèm thông tin sản phẩm) | cần đăng nhập |
| POST   | `/favorites`            | Thêm sản phẩm vào yêu thích (`productId`)                          | cần đăng nhập |
| DELETE | `/favorites/:productId` | Xoá sản phẩm khỏi yêu thích                                        | cần đăng nhập |

## Contact messages

| Method | Endpoint                     | Mô tả                                                                  | Quyền  |
| ------ | ---------------------------- | ---------------------------------------------------------------------- | ------ |
| POST   | `/contact-messages`          | Gửi tin nhắn liên hệ (`firstName`, `lastName`, `email`, `message`,...) | public |
| GET    | `/contact-messages`          | Lấy danh sách tin nhắn                                                 | admin  |
| PATCH  | `/contact-messages/:id/read` | Đánh dấu đã đọc/chưa đọc (`isRead`, mặc định `true`)                   | admin  |
| DELETE | `/contact-messages/:id`      | Xoá tin nhắn                                                           | admin  |

## Articles

| Method | Endpoint        | Mô tả                                                | Quyền  |
| ------ | --------------- | ---------------------------------------------------- | ------ |
| GET    | `/articles`     | Danh sách bài viết, mới nhất trước, hỗ trợ `?limit=` | public |
| GET    | `/articles/:id` | Lấy 1 bài viết theo id                               | public |

## Test nhanh bằng curl

```bash
# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"111111"}'

# Lấy profile (thay <TOKEN> bằng accessToken vừa nhận)
curl http://localhost:4000/auth/me -H "Authorization: Bearer <TOKEN>"

# Lấy giỏ hàng active
curl http://localhost:4000/carts/active -H "Authorization: Bearer <TOKEN>"

# Tạo sản phẩm mới (cần admin token)
curl -X POST http://localhost:4000/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Áo test","price":19.99,"category":"men'"'"'s clothing"}'
```

## Ghi chú cho việc học

- Đây là mock server, password lưu plaintext trong JSON — **không** làm vậy với project thật (cần hash bằng bcrypt).
- `validRefreshTokens` lưu trong bộ nhớ (RAM) nên sẽ mất khi restart server — thực tế nên lưu DB hoặc Redis.
- File `src/db.js` là 1 lớp đọc/ghi JSON đơn giản, không xử lý ghi đồng thời (race condition) — không dùng cho production.
- Các route public như `GET /carts`, `GET /carts/:id` hiện không kiểm tra quyền sở hữu — chỉ phù hợp cho môi trường học tập/demo.
