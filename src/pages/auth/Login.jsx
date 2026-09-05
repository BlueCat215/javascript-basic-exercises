import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

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
      setAuth(data);
      toast.success("Đăng nhập thành công!");
      navigate(from, { replace: true });
    },
    onError: () => {
      toast.error("Vui lòng kiểm tra lại thông tin!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      return toast.error("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
    }
    loginMutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full bg-surface p-8 rounded-tag border border-line tag-card space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold text-ink tracking-tight">
            Đăng nhập
          </h1>
          <p className="text-sm font-sans text-ink/70">
            Hệ thống quản lý sản phẩm
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-1">
            <label
              className="block text-sm font-semibold font-sans text-ink"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              placeholder="ví dụ: hoang"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-tag border border-line bg-paper text-ink font-mono focus:bg-surface focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label
              className="block text-sm font-semibold font-sans text-ink"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-tag border border-line bg-paper text-ink font-mono focus:bg-surface focus:outline-none focus:border-ink transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-sm font-sans rounded-tag">
              {error.response?.data?.message ||
                "Tài khoản hoặc mật khẩu không chính xác."}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full flex justify-center items-center gap-2 mt-2"
          >
            {isPending ? (
              <span className="flex items-center gap-2">Đang xử lý...</span>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
