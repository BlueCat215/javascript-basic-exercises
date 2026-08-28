const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const carts = new JsonCollection("carts.json");

// GET /carts?startdate=...&enddate=...&limit=...  -> giống fakestoreapi (bỏ qua filter ngày cho đơn giản)
router.get("/", (req, res) => {
  let items = carts.findAll();
  const { limit, sort } = req.query;

  if (sort === "asc") items = [...items].sort((a, b) => a.id - b.id);
  if (sort === "desc") items = [...items].sort((a, b) => b.id - a.id);
  if (limit) items = items.slice(0, Number(limit));

  res.json(items);
});

// GET /carts/user/:userId
router.get("/user/:userId", (req, res) => {
  const items = carts.findAll().filter((c) => c.userId === Number(req.params.userId));
  res.json(items);
});

// GET /carts/:id
router.get("/:id", (req, res) => {
  const item = carts.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(item);
});

// POST /carts (cần đăng nhập)
router.post("/", authenticateToken, (req, res) => {
  const { userId, products: cartProducts, date } = req.body;
  if (!userId || !Array.isArray(cartProducts)) {
    return res.status(400).json({ message: "Thiếu userId hoặc products" });
  }
  const newCart = carts.create({
    userId,
    date: date || new Date().toISOString(),
    products: cartProducts,
  });
  res.status(201).json(newCart);
});

// PUT /carts/:id (cần đăng nhập, thay toàn bộ)
router.put("/:id", authenticateToken, (req, res) => {
  const updated = carts.updateById(req.params.id, req.body, { replace: true });
  if (!updated) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(updated);
});

// PATCH /carts/:id (cần đăng nhập, cập nhật 1 phần)
router.patch("/:id", authenticateToken, (req, res) => {
  const updated = carts.updateById(req.params.id, req.body, { replace: false });
  if (!updated) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(updated);
});

// DELETE /carts/:id (cần đăng nhập)
router.delete("/:id", authenticateToken, (req, res) => {
  const deleted = carts.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(deleted);
});

module.exports = router;
