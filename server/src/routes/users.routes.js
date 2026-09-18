const express = require("express");
const JsonCollection = require("../db");
const { authenticateToken, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
const users = new JsonCollection("users.json");

// Loại bỏ password trước khi trả dữ liệu về client.
function stripPassword(user) {
  if (!user) return user;

  const { password, ...safe } = user;
  return safe;
}

// Cho phép admin hoặc chính chủ tài khoản truy cập.
function isSelfOrAdmin(req, res, next) {
  const targetId = Number(req.params.id);
  const currentUserId = Number(req.user.id);

  if (req.user.role === "admin" || currentUserId === targetId) {
    return next();
  }

  return res.status(403).json({
    message: "Không có quyền truy cập",
  });
}

// Lấy danh sách người dùng.
// Chỉ admin được phép truy cập.
router.get(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const allUsers = await users.findAll();
      const items = allUsers.map(stripPassword);

      res.json(items);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({
        message: "Lỗi hệ thống khi tải danh sách người dùng",
      });
    }
  },
);

// Lấy thông tin một user.
// Chỉ chính chủ hoặc admin được phép truy cập.
router.get("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const item = await users.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.json(stripPassword(item));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi tìm người dùng",
    });
  }
});

// Đăng ký tài khoản mới.
// User đăng ký công khai mặc định có role customer.
router.post("/", async (req, res) => {
  try {
    const { email, username, password, name, address, phone, role } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Thiếu email/username/password",
      });
    }

    // Kiểm tra username đã tồn tại.
    const allUsers = await users.findAll();
    const existed = allUsers.some((u) => u.username === username);

    if (existed) {
      return res.status(409).json({
        message: "Username đã tồn tại",
      });
    }

    // Không cho phép tự đăng ký tài khoản admin.
    const newUser = await users.create({
      email,
      username,
      password,
      name: name || { firstname: "", lastname: "" },
      address: address || {},
      phone: phone || "",
      role: role === "admin" ? "customer" : role || "customer",
    });

    res.status(201).json(stripPassword(newUser));
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi đăng ký tài khoản",
    });
  }
});

// Admin tạo tài khoản mới.
router.post(
  "/admin-create",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { email, username, password, name, role } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({
          message: "Thiếu email/username/password",
        });
      }

      // Kiểm tra username đã tồn tại.
      const allUsers = await users.findAll();

      if (allUsers.some((u) => u.username === username)) {
        return res.status(409).json({
          message: "Username đã tồn tại",
        });
      }

      // Admin có thể tạo user với role tùy ý.
      const newUser = await users.create({
        email,
        username,
        password,
        name: name || { firstname: "", lastname: "" },
        address: {},
        phone: "",
        role: role || "customer",
      });

      res.status(201).json(stripPassword(newUser));
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi tạo tài khoản",
      });
    }
  },
);

// Cập nhật toàn bộ thông tin user.
router.put("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const body = { ...req.body };

    // User thường không được tự nâng quyền thành admin.
    if (body.role === "admin" && req.user.role !== "admin") {
      delete body.role;
    }

    const updated = await users.updateById(req.params.id, body, {
      replace: true,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.json(stripPassword(updated));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi cập nhật thông tin",
    });
  }
});

// Đổi mật khẩu.
router.patch(
  "/:id/password",
  authenticateToken,
  isSelfOrAdmin,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await users.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }

    // Kiểm tra mật khẩu hiện tại.
    if (user.password !== currentPassword) {
      return res.status(400).json({
        message: "Mật khẩu hiện tại không đúng",
      });
    }

    await users.updateById(
      req.params.id,
      { password: newPassword },
      { replace: false },
    );

    res.json({
      message: "Đổi mật khẩu thành công",
    });
  },
);

// Cập nhật một phần thông tin user.
router.patch("/:id", authenticateToken, isSelfOrAdmin, async (req, res) => {
  try {
    const body = { ...req.body };

    // User thường không được tự nâng quyền thành admin.
    if (body.role === "admin" && req.user.role !== "admin") {
      delete body.role;
    }

    const updated = await users.updateById(req.params.id, body, {
      replace: false,
    });

    if (!updated) {
      return res.status(404).json({
        message: "Không tìm thấy user",
      });
    }

    res.json(stripPassword(updated));
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi sửa thông tin",
    });
  }
});

// Xóa user.
// Chỉ admin được phép thực hiện.
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const deleted = await users.deleteById(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          message: "Không tìm thấy user",
        });
      }

      res.json(stripPassword(deleted));
    } catch (error) {
      res.status(500).json({
        message: "Lỗi hệ thống khi xóa người dùng",
      });
    }
  },
);

module.exports = router;
