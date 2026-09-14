const express = require("express");
const JsonCollection = require("../db");

const router = express.Router();
const articles = new JsonCollection("articles.json");

// GET /articles?limit=5
// Dùng cho khối "What's New Today" ở trang chủ
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    let items = await articles.findAll();
    items = [...items].sort((a, b) => a.minutesAgo - b.minutesAgo);
    if (limit) items = items.slice(0, Number(limit));
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi lấy bài viết" });
  }
});

// GET /articles/:id
router.get("/:id", async (req, res) => {
  try {
    const item = await articles.findById(req.params.id);
    if (!item)
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống khi tìm bài viết" });
  }
});

module.exports = router;
