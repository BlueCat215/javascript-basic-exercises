import axios from "axios";

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await axios.post(
    `${import.meta.env.VITE_SERVER_URL}/auth/refresh-token`,
    {
      refreshToken,
    },
  );

  return res.data.newAccessToken;
};
