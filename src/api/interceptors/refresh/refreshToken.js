import axios from "axios";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const res = await axios.post("http://localhost:4000/auth/refresh-token", {
    refreshToken,
  });
  return res.data.newAccessToken;
};
