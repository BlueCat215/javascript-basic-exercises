// src/routes/orders.routes.js
const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const orders = new JsonCollection("orders.json");
const carts = new JsonCollection("carts.json");

// Tạo đơn hàng từ giỏ hàng active hiện tại
router.post("/", authenticateToken, (req, res) => {
  const { shippingInfo, paymentMethod } = req.body;
  const allCarts = carts.findAll();
  const activeCart = allCarts.find(
    (c) => c.userId === req.user.id && c.status === "active",
  );

  if (!activeCart || activeCart.products.length === 0) {
    return res.status(400).json({ message: "Giỏ hàng đang trống" });
  }

  const newOrder = orders.create({
    userId: req.user.id,
    products: activeCart.products,
    shippingInfo,
    paymentMethod,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  // Đánh dấu cart cũ là đã đặt hàng, tạo cart active mới trống
  carts.updateById(activeCart.id, { status: "ordered" }, { replace: false });
  carts.create({
    userId: req.user.id,
    status: "active",
    products: [],
    date: new Date().toISOString(),
  });

  res.status(201).json(newOrder);
});

router.get("/user/:userId", authenticateToken, (req, res) => {
  const targetId = Number(req.params.userId);
  if (req.user.role !== "admin" && req.user.id !== targetId) {
    return res.status(403).json({ message: "Không có quyền truy cập" });
  }
  const items = orders.findAll().filter((o) => o.userId === targetId);
  res.json(items);
});

router.get("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  res.json(orders.findAll());
});

router.patch(
  "/:id/status",
  authenticateToken,
  authorizeRoles("admin"),
  (req, res) => {
    const updated = orders.updateById(
      req.params.id,
      { status: req.body.status },
      { replace: false },
    );
    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.json(updated);
  },
);

module.exports = router;
