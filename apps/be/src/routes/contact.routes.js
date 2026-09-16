const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

const messages = new JsonCollection("contact-messages.json");

// Gửi tin nhắn liên hệ.
router.post("/", async (req, res) => {
  const { firstName, lastName, email, phone, country, subject, message } =
    req.body;

  // Kiểm tra các thông tin bắt buộc.
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc",
    });
  }

  // Lưu tin nhắn mới.
  const created = await messages.create({
    firstName,
    lastName,
    email,
    phone,
    country,
    subject,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  });

  res.status(201).json(created);
});

// Lấy danh sách tin nhắn.
// Chỉ admin mới được phép truy cập.
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    res.json(await messages.findAll());
  },
);

// Đánh dấu tin nhắn đã đọc hoặc chưa đọc.
router.patch(
  "/:id/read",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { isRead = true } = req.body;

      const updated = await messages.updateById(
        req.params.id,
        { isRead: Boolean(isRead) },
        { replace: false },
      );

      if (!updated) {
        return res.status(404).json({
          message: "Không tìm thấy tin nhắn",
        });
      }

      res.json(updated);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi cập nhật tin nhắn",
      });
    }
  },
);

// Xóa tin nhắn.
// Chỉ admin mới được phép thực hiện.
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await messages.deleteById(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Không tìm thấy tin nhắn",
        });
      }

      res.json(deleted);
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi xóa tin nhắn",
      });
    }
  },
);

module.exports = router;
