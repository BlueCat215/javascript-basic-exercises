const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const favorites = new JsonCollection("favorites.json");
const products = new JsonCollection("products.json");

router.get("/", authenticateToken, (req, res) => {
  const mine = favorites.findAll().filter((f) => f.userId === req.user.id);
  const enriched = mine.map((f) => ({
    ...f,
    product: products.findById(f.productId),
  }));
  res.json(enriched);
});

router.post("/", authenticateToken, (req, res) => {
  const { productId } = req.body;
  const existed = favorites
    .findAll()
    .find((f) => f.userId === req.user.id && f.productId === productId);
  if (existed)
    return res.status(409).json({ message: "Đã có trong danh sách yêu thích" });

  const created = favorites.create({ userId: req.user.id, productId });
  res.status(201).json(created);
});

router.delete("/:productId", authenticateToken, (req, res) => {
  const productId = Number(req.params.productId);
  const item = favorites
    .findAll()
    .find((f) => f.userId === req.user.id && f.productId === productId);
  if (!item) return res.status(404).json({ message: "Không tìm thấy" });

  favorites.deleteById(item.id);
  res.json({ message: "Đã xóa khỏi yêu thích" });
});

module.exports = router;
