const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const carts = new JsonCollection("carts.json");
const productsCollection = new JsonCollection("products.json");

function enrichCart(cart) {
  if (!cart) return null;
  const products = (cart.products || []).map((item) => {
    const product = productsCollection.findById(item.productId);
    return { ...item, product };
  });
  return { ...cart, products };
}

function findOrCreateActiveCart(userId) {
  const all = carts.findAll();
  const targetUserId = Number(userId);

  let active = all.find(
    (c) => Number(c.userId) === targetUserId && c.status === "active",
  );

  if (!active) {
    active = carts.create({
      userId: targetUserId,
      status: "active",
      products: [],
      date: new Date().toISOString(),
    });
  }
  return active;
}

// ===== GET giỏ hàng đang dùng của user hiện tại =====
router.get("/active", authenticateToken, (req, res) => {
  const active = findOrCreateActiveCart(req.user.id);
  res.json(enrichCart(active));
});

// ===== Thêm sản phẩm =====
router.post("/active/items", authenticateToken, (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) return res.status(400).json({ message: "Thiếu productId" });

  const targetProductId = Number(productId); // Ép kiểu chống lỗi data type
  const active = findOrCreateActiveCart(req.user.id);

  const existing = active.products.find(
    (p) => Number(p.productId) === targetProductId,
  );

  const newProducts = existing
    ? active.products.map((p) =>
        Number(p.productId) === targetProductId
          ? { ...p, quantity: p.quantity + Number(quantity) }
          : p,
      )
    : [
        ...active.products,
        { productId: targetProductId, quantity: Number(quantity) },
      ];

  const updated = carts.updateById(
    active.id,
    { products: newProducts },
    { replace: false },
  );
  res.json(enrichCart(updated));
});

// ===== Sửa số lượng chính xác 1 sản phẩm =====
router.patch("/active/items/:productId", authenticateToken, (req, res) => {
  const { quantity } = req.body;
  if (quantity === undefined)
    return res.status(400).json({ message: "Thiếu quantity" });

  const active = findOrCreateActiveCart(req.user.id);
  const productId = Number(req.params.productId);

  const newProducts = active.products.map((p) =>
    Number(p.productId) === productId
      ? { ...p, quantity: Math.max(1, Number(quantity)) }
      : p,
  );

  const updated = carts.updateById(
    active.id,
    { products: newProducts },
    { replace: false },
  );
  res.json(enrichCart(updated));
});

// ===== Xóa 1 sản phẩm khỏi giỏ =====
router.delete("/active/items/:productId", authenticateToken, (req, res) => {
  const active = findOrCreateActiveCart(req.user.id);
  const productId = Number(req.params.productId);

  const newProducts = active.products.filter(
    (p) => Number(p.productId) !== productId,
  );

  const updated = carts.updateById(
    active.id,
    { products: newProducts },
    { replace: false },
  );
  res.json(enrichCart(updated));
});

// ===== Xóa hết giỏ hàng =====
router.delete("/active", authenticateToken, (req, res) => {
  const active = findOrCreateActiveCart(req.user.id);
  const updated = carts.updateById(
    active.id,
    { products: [] },
    { replace: false },
  );
  res.json(enrichCart(updated));
});

// GET /carts với bộ lọc limit và sort
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
  const items = carts
    .findAll()
    .filter((c) => Number(c.userId) === Number(req.params.userId));
  res.json(items);
});

// GET /carts/:id
router.get("/:id", (req, res) => {
  const item = carts.findById(req.params.id);
  if (!item)
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(item);
});

// POST /carts
router.post("/", authenticateToken, (req, res) => {
  const { userId, products: cartProducts, date } = req.body;
  if (!userId || !Array.isArray(cartProducts)) {
    return res.status(400).json({ message: "Thiếu userId hoặc products" });
  }
  const newCart = carts.create({
    userId: Number(userId),
    date: date || new Date().toISOString(),
    products: cartProducts.map((p) => ({
      productId: Number(p.productId),
      quantity: Number(p.quantity),
    })),
  });
  res.status(201).json(newCart);
});

// PUT /carts/:id
router.put("/:id", authenticateToken, (req, res) => {
  const updated = carts.updateById(req.params.id, req.body, { replace: true });
  if (!updated)
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(updated);
});

// PATCH /carts/:id
router.patch("/:id", authenticateToken, (req, res) => {
  const updated = carts.updateById(req.params.id, req.body, { replace: false });
  if (!updated)
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(updated);
});

// DELETE /carts/:id
router.delete("/:id", authenticateToken, (req, res) => {
  const deleted = carts.deleteById(req.params.id);
  if (!deleted)
    return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
  res.json(deleted);
});

module.exports = router;
