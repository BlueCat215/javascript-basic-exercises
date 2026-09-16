require("dotenv").config();

module.exports = {
  ACCESS_SECRET: process.env.ACCESS_SECRET || "access-secret-demo",
  REFRESH_SECRET: process.env.REFRESH_SECRET || "refresh-secret-demo",

  ACCESS_TOKEN_EXPIRES_IN: "15m",
  REFRESH_TOKEN_EXPIRES_IN: "7d",

  PORT: process.env.PORT || 4000,
};
