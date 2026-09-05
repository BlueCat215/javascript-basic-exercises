const express = require("express");
const cors = require("cors");

const { PORT } = require("./src/config");
const authRoutes = require("./src/routes/auth.routes");
const productsRoutes = require("./src/routes/products.routes");
const usersRoutes = require("./src/routes/users.routes");
const cartsRoutes = require("./src/routes/carts.routes");
const ordersRoutes = require("./src/routes/orders.routes");
const vouchersRoutes = require("./src/routes/vouchers.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/carts", cartsRoutes);
app.use("/orders", ordersRoutes);
app.use("/vouchers", vouchersRoutes);

app.get("/", (req, res) => {
  res.json({
    message:
      "Mock Store API đang chạy. Xem README.md để biết danh sách endpoint.",
  });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy endpoint" });
});

app.listen(PORT, () => {
  console.log(`Mock server chạy tại http://localhost:${PORT}`);
});
