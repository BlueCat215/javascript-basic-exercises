import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { loginSchema } from "../../schemas/loginSchema";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    mutate: loginMutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ username, password }) => login(username, password),
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Đăng nhập thành công!");
      const from = location.state?.from?.pathname;
      if (from) {
        return navigate(from, { replace: true });
      }
      navigate(data.user.role === "admin" ? "/admin" : "/", { replace: true });
    },
    onError: () => {
      toast.error("Vui lòng kiểm tra lại thông tin!");
    },
  });

  const onSubmit = (formData) => {
    loginMutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4">
      <div className="max-w-sm w-full bg-surface p-8 rounded-tag border border-line space-y-6">
        <h1 className="text-2xl font-display font-bold text-ink text-center">
          Đăng nhập
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("username")}
              placeholder="Username"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.username && (
              <p className="text-rust text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Password"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.password && (
              <p className="text-rust text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-rust text-sm">
              {error.response?.data?.message || "Sai tài khoản hoặc mật khẩu"}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isPending ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-gold hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
