const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const users = new JsonCollection("users.json");

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

/** Cho phép nếu là admin, hoặc chính chủ tài khoản (req.user.id === id trong param) */
function isSelfOrAdmin(req, res, next) {
  const targetId = Number(req.params.id);
  if (req.user.role === "admin" || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ message: "Không có quyền truy cập" });
}

// GET /users (chỉ admin)
router.get("/", authenticateToken, authorizeRoles("admin"), (req, res) => {
  const items = users.findAll().map(stripPassword);
  res.json(items);
});

// GET /users/:id (chính chủ hoặc admin)
router.get("/:id", authenticateToken, isSelfOrAdmin, (req, res) => {
  const item = users.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(stripPassword(item));
});

// POST /users (đăng ký user mới, mặc định role "customer")
router.post("/", (req, res) => {
  const { email, username, password, name, address, phone, role } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Thiếu email/username/password" });
  }

  const existed = users.findAll().some((u) => u.username === username);
  if (existed) {
    return res.status(409).json({ message: "Username đã tồn tại" });
  }

  const newUser = users.create({
    email,
    username,
    password,
    name: name || { firstname: "", lastname: "" },
    address: address || {},
    phone: phone || "",
    // Không cho client tự phong admin qua route đăng ký công khai
    role: role === "admin" ? "customer" : role || "customer",
  });

  res.status(201).json(stripPassword(newUser));
});

// PUT /users/:id (chính chủ hoặc admin, thay toàn bộ)
router.put("/:id", authenticateToken, isSelfOrAdmin, (req, res) => {
  const body = { ...req.body };
  // chỉ admin mới được đổi role người khác thành admin
  if (body.role === "admin" && req.user.role !== "admin") {
    delete body.role;
  }
  const updated = users.updateById(req.params.id, body, { replace: true });
  if (!updated) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(stripPassword(updated));
});

// PATCH /users/:id (chính chủ hoặc admin, cập nhật 1 phần)
router.patch("/:id", authenticateToken, isSelfOrAdmin, (req, res) => {
  const body = { ...req.body };
  if (body.role === "admin" && req.user.role !== "admin") {
    delete body.role;
  }
  const updated = users.updateById(req.params.id, body, { replace: false });
  if (!updated) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(stripPassword(updated));
});

// DELETE /users/:id (chỉ admin)
router.delete("/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
  const deleted = users.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Không tìm thấy user" });
  res.json(stripPassword(deleted));
});

module.exports = router;
