import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/service/authService";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const from = location.state?.from?.pathname || "/";

  const {
    mutate: loginMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => login(username, password),
    onSuccess: (data) => {
      // data = { accessToken, refreshToken, user }
      setAuth(data);
      navigate(from, { replace: true });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-24 space-y-4 p-6 border border-line rounded-tag"
    >
      <h1 className="text-2xl font-bold text-ink">Đăng nhập</h1>

      <input
        type="text"
        placeholder="Username (thử: hoang)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 w-full"
        required
      />
      <input
        type="password"
        placeholder="Password (thử: 123456)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
        required
      />

      {error && (
        <p className="text-red-500 text-sm">
          {error.response?.data?.message || "Đăng nhập thất bại"}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}
