const express = require("express");
const JsonCollection = require("../db");

const router = express.Router();

const articles = new JsonCollection("articles.json");

// GET /articles?limit=5
// Lấy danh sách bài viết mới nhất.
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    // Lấy tất cả bài viết và sắp xếp theo thời gian đăng.
    let items = await articles.findAll();
    items = [...items].sort((a, b) => a.minutesAgo - b.minutesAgo);

    // Giới hạn số lượng bài viết nếu có truyền limit.
    if (limit) items = items.slice(0, Number(limit));

    res.json(items);
  } catch (error) {
    // Xử lý lỗi khi lấy danh sách bài viết.
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy bài viết",
    });
  }
});

// GET /articles/:id
// Lấy thông tin một bài viết theo ID.
router.get("/:id", async (req, res) => {
  try {
    // Tìm bài viết theo ID.
    const item = await articles.findById(req.params.id);

    // Không tìm thấy bài viết.
    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết",
      });
    }

    res.json(item);
  } catch (error) {
    // Xử lý lỗi khi tìm bài viết.
    res.status(500).json({
      message: "Lỗi hệ thống khi tìm bài viết",
    });
  }
});

module.exports = router;
