const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config");

/**
 * Xác thực Access Token từ header Authorization.
 * Token hợp lệ sẽ được lưu vào req.user.
 */
function authenticateToken(req, res, next) {
  // Lấy token từ header Authorization.
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // Không có token.
  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  try {
    // Kiểm tra và giải mã token.
    const payload = jwt.verify(token, ACCESS_SECRET);

    // Lưu thông tin người dùng vào request.
    req.user = payload;

    next();
  } catch (err) {
    // Token hết hạn hoặc không hợp lệ.
    return res.status(401).json({
      message: "Token hết hạn hoặc không hợp lệ",
    });
  }
}

/**
 * Kiểm tra role của người dùng.
 * Phải dùng sau authenticateToken().
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // Chưa có thông tin người dùng.
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }

    // Role không được phép truy cập.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Không có quyền truy cập",
      });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
