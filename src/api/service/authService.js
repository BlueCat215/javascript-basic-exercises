import authApi from "../config/authConfig";

const login = (username, password) => {
  return authApi.post("/auth/login", { username, password });
};

const refreshToken = (refreshToken) => {
  return authApi.post("/auth/refresh-token", { refreshToken });
};

const logout = (refreshToken) => {
  return authApi.post("/auth/logout", { refreshToken });
};

const getMe = (token) => {
  return authApi.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { login, refreshToken, logout, getMe };
