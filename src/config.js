require("dotenv").config();

module.exports = {
  ACCESS_SECRET: process.env.ACCESS_SECRET || "access-secret-demo",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "refresh-secret-demo",

  // --- ĐÃ ĐIỀU CHỈNH ĐỂ DỄ TEST REFRESH TOKEN ---
  ACCESS_TOKEN_EXPIRES_IN: "15s", // Hết hạn sau 15 giây (hoặc "1m" nếu muốn 1 phút)
  REFRESH_TOKEN_EXPIRES_IN: "7d", // Hết hạn sau 7 ngày

  PORT: process.env.PORT || 4000,
};
