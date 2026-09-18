const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

const favorites = new JsonCollection("favorites.json");
const products = new JsonCollection("products.json");

// Lấy danh sách sản phẩm yêu thích của user hiện tại.
router.get("/", authenticateToken, async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);

    // Lấy các sản phẩm yêu thích của user.
    const allFavorites = await favorites.findAll();
    const mine = allFavorites.filter((f) => Number(f.userId) === currentUserId);

    // Tạo Map để tìm sản phẩm nhanh theo ID.
    const allProducts = await products.findAll();
    const productMap = new Map(allProducts.map((p) => [p.id, p]));

    // Bổ sung thông tin sản phẩm vào danh sách yêu thích.
    const enriched = mine.map((f) => ({
      ...f,
      product: productMap.get(Number(f.productId)) || null,
    }));

    res.json(enriched);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy danh sách yêu thích",
    });
  }
});

// Thêm sản phẩm vào danh sách yêu thích.
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "Thiếu productId",
      });
    }

    const currentUserId = Number(req.user.id);
    const targetProductId = Number(productId);

    // Kiểm tra sản phẩm đã có trong danh sách yêu thích chưa.
    const allFavorites = await favorites.findAll();
    const existed = allFavorites.find(
      (f) =>
        Number(f.userId) === currentUserId &&
        Number(f.productId) === targetProductId,
    );

    if (existed) {
      return res.status(409).json({
        message: "Đã có trong danh sách yêu thích",
      });
    }

    // Tạo bản ghi yêu thích mới.
    const created = await favorites.create({
      userId: currentUserId,
      productId: targetProductId,
    });

    res.status(201).json(created);
  } catch (error) {
    console.error("Error adding favorite:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi thêm yêu thích",
    });
  }
});

// Xóa sản phẩm khỏi danh sách yêu thích.
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const currentUserId = Number(req.user.id);
    const targetProductId = Number(req.params.productId);

    // Tìm sản phẩm yêu thích của user.
    const allFavorites = await favorites.findAll();
    const item = allFavorites.find(
      (f) =>
        Number(f.userId) === currentUserId &&
        Number(f.productId) === targetProductId,
    );

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy trong danh sách yêu thích",
      });
    }

    // Xóa sản phẩm khỏi danh sách yêu thích.
    await favorites.deleteById(item.id);

    res.json({
      message: "Đã xóa khỏi yêu thích",
    });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi xóa yêu thích",
    });
  }
});

module.exports = router;
