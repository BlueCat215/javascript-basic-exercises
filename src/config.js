// Trong project thật: đọc từ biến môi trường (process.env), KHÔNG hardcode secret.
module.exports = {
  ACCESS_SECRET: process.env.ACCESS_SECRET || "access-secret-demo",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "refresh-secret-demo",
  ACCESS_TOKEN_EXPIRES_IN: "60s", // để hết hạn nhanh cho dễ test refresh
  REFRESH_TOKEN_EXPIRES_IN: "7d",
  PORT: process.env.PORT || 4000,
};
