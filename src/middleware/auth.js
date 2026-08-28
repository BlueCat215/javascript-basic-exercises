const jwt = require("jsonwebtoken");
const { ACCESS_SECRET } = require("../config");

/** Bắt buộc phải có access token hợp lệ trong header Authorization: Bearer <token> */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Chưa đăng nhập" });
  }

  jwt.verify(token, ACCESS_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
    }
    req.user = payload; // { id, username, email, role, ... }
    next();
  });
}

/** Dùng sau authenticateToken. Ví dụ: authorizeRoles("admin") */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Chưa đăng nhập" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
