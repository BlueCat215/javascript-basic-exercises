const express = require("express");
const JsonCollection = require("../db");

const router = express.Router();
const vouchers = new JsonCollection("vouchers.json");

// Áp dụng mã giảm giá.
router.post("/apply", async (req, res) => {
  try {
    const { code } = req.body;

    // Kiểm tra mã giảm giá.
    if (!code) {
      return res.status(400).json({
        message: "Vui lòng nhập mã giảm giá",
      });
    }

    // Lấy danh sách voucher.
    const allVouchers = await vouchers.findAll();

    // Tìm voucher theo mã.
    const found = allVouchers.find((v) => v.code === code.trim().toUpperCase());

    if (!found) {
      return res.status(404).json({
        message: "Mã giảm giá không tồn tại",
      });
    }

    // Kiểm tra voucher có đang hoạt động không.
    if (found.isActive === false) {
      return res.status(400).json({
        message: "Mã giảm giá này đã bị vô hiệu hóa",
      });
    }

    // Kiểm tra thời hạn sử dụng.
    if (found.expiryDate && new Date(found.expiryDate) < new Date()) {
      return res.status(400).json({
        message: "Mã giảm giá đã hết hạn sử dụng",
      });
    }

    res.json(found);
  } catch (error) {
    console.error("Error applying voucher:", error);

    res.status(500).json({
      message: "Lỗi hệ thống khi áp dụng mã giảm giá",
    });
  }
});

module.exports = router;
