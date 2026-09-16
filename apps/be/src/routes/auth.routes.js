const express = require("express");
const jwt = require("jsonwebtoken");
const JsonCollection = require("../db");
const {
  ACCESS_SECRET,
  REFRESH_SECRET,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../config");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const usersCollection = new JsonCollection("users.json");

let validRefreshTokens = [];

// Tạo Access Token và Refresh Token.
function signTokens(userSafe) {
  const accessToken = jwt.sign(userSafe, ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(userSafe, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
}

// Đăng nhập.
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Tìm người dùng theo tài khoản và mật khẩu.
    const users = await usersCollection.findAll();
    const user = users.find(
      (u) => u.username === username && u.password === password,
    );

    if (!user) {
      return res.status(400).json({
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    // Kiểm tra tài khoản có bị khóa không.
    if (user.isLocked) {
      return res.status(403).json({
        message: "Tài khoản đã bị khoá",
      });
    }

    // Loại bỏ password trước khi tạo token và trả về client.
    const { password: _, ...userSafe } = user;

    // Tạo token và lưu Refresh Token hợp lệ.
    const { accessToken, refreshToken } = signTokens(userSafe);
    validRefreshTokens.push(refreshToken);

    res.json({ accessToken, refreshToken, user: userSafe });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi đăng nhập",
    });
  }
});

// Làm mới Access Token bằng Refresh Token.
router.post("/refresh-token", (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Kiểm tra Refresh Token có tồn tại và còn được lưu không.
    if (!refreshToken || !validRefreshTokens.includes(refreshToken)) {
      return res.status(401).json({
        message: "Refresh token không hợp lệ",
      });
    }

    try {
      // Xác thực Refresh Token.
      const payload = jwt.verify(refreshToken, REFRESH_SECRET);

      // Loại bỏ thông tin thời gian trước khi tạo Access Token mới.
      const { iat, exp, ...userSafe } = payload;

      const newAccessToken = jwt.sign(userSafe, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });

      res.json({ newAccessToken });
    } catch (err) {
      // Xóa Refresh Token đã hết hạn hoặc không hợp lệ.
      validRefreshTokens = validRefreshTokens.filter((t) => t !== refreshToken);

      return res.status(401).json({
        message: "Refresh token hết hạn hoặc không hợp lệ",
      });
    }
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(500).json({
      message: "Lỗi hệ thống khi làm mới token",
    });
  }
});

// Đăng xuất.
router.post("/logout", (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Xóa Refresh Token khỏi danh sách đang hoạt động.
    validRefreshTokens = validRefreshTokens.filter((t) => t !== refreshToken);

    res.json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi đăng xuất",
    });
  }
});

// Lấy thông tin người dùng hiện tại.
router.get("/me", authenticateToken, (req, res) => {
  try {
    // Loại bỏ thông tin thời gian trước khi trả về client.
    const { iat, exp, ...userSafe } = req.user;

    res.json(userSafe);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi hệ thống khi lấy thông tin cá nhân",
    });
  }
});

module.exports = router;
