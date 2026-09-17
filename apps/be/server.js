const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const { PORT } = require("./src/config");
const authRoutes = require("./src/routes/auth.routes");
const productsRoutes = require("./src/routes/products.routes");
const usersRoutes = require("./src/routes/users.routes");
const cartsRoutes = require("./src/routes/carts.routes");
const ordersRoutes = require("./src/routes/orders.routes");
const vouchersRoutes = require("./src/routes/vouchers.routes");
const favoritesRoutes = require("./src/routes/favorites.routes");
const contactRoutes = require("./src/routes/contact.routes");
const articlesRoutes = require("./src/routes/articles.routes");

const dataDir = path.join(__dirname, "data");

// Tạo thư mục data nếu chưa tồn tại.
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const app = express();

// Middleware cơ bản.
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Đăng ký các API routes.
app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", ordersRoutes);
app.use("/vouchers", vouchersRoutes);
app.use("/favorites", favoritesRoutes);
app.use("/contact-messages", contactRoutes);
app.use("/articles", articlesRoutes);

// API kiểm tra server.
app.get("/", (req, res) => {
  res.json({
    message:
      "Mock Store API đang chạy. Xem README.md để biết danh sách endpoint.",
  });
});

// Xử lý endpoint không tồn tại.
app.use((req, res) => {
  res.status(404).json({
    message: "Không tìm thấy endpoint",
  });
});

// Middleware xử lý lỗi tập trung.
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err);

  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Ảnh vượt quá dung lượng cho phép (tối đa 3MB)",
      LIMIT_FILE_COUNT: "Vượt quá số lượng ảnh cho phép (tối đa 6 ảnh)",
      LIMIT_UNEXPECTED_FILE: "Trường upload không hợp lệ",
    };

    return res.status(400).json({
      message: messages[err.code] || "Lỗi khi upload ảnh",
    });
  }

  if (err.message?.startsWith("Chỉ chấp nhận file ảnh")) {
    return res.status(400).json({ message: err.message });
  }

  // Xử lý JSON gửi lên bị sai định dạng.
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Dữ liệu JSON gửi lên sai định dạng",
    });
  }

  // Xử lý các lỗi không xác định.
  res.status(500).json({
    message: "Lỗi hệ thống ngoài dự kiến",
  });
});

// Khởi động server.
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
