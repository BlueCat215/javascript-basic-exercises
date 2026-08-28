import authClient from "../clients/authClient";

const login = (username, password) => {
  return authClient.post("/auth/login", { username, password });
};

const refreshToken = (refreshToken) => {
  return authClient.post("/auth/refresh-token", { refreshToken });
};

const logout = (refreshToken) => {
  return authClient.post("/auth/logout", { refreshToken });
};

const getMe = (token) => {
  return authClient.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { login, refreshToken, logout, getMe };
