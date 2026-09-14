import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { loginSchema } from "../../schemas/loginSchema";
import { Breadcrumb } from "../../components/Breadcrumb";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const from = location.state?.from?.pathname;
  const [showPassword, setShowPassword] = useState(false);

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
      navigate(from || (data.user.role === "admin" ? "/admin" : "/"), {
        replace: true,
      });
    },
    onError: () => toast.error("Đăng nhập thất bại"),
  });

  const onSubmit = (formData) => loginMutate(formData);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Đăng nhập" }]} />
      <div className="bg-white rounded-2xl border border-line p-8 sm:p-14 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 flex justify-center items-center">
            <img
              src="/login.svg"
              alt="Login Illustration"
              className="w-full max-h-100 object-contain"
            />
          </div>

          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:mx-0">
            <div className="mb-7">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-green">
                Đăng nhập
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-ink/50 mt-1.5">
                Tiếp tục để mua sắm
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Tên đăng nhập
                </label>
                <input
                  {...register("username")}
                  placeholder="VD: hoang"
                  className="w-full px-4 py-2.5 bg-white border border-line rounded-md text-sm text-ink placeholder-ink/40 focus:border-green focus:ring-1 focus:ring-green outline-none"
                />
                {errors.username && (
                  <p className="text-rust text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-white border border-line rounded-md text-sm text-ink placeholder-ink/40 pr-14 focus:border-green focus:ring-1 focus:ring-green outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink/70 text-xs font-semibold"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rust text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-left pt-0.5">
                <span
                  title="Tính năng đang phát triển"
                  className="text-xs text-ink/30 font-medium cursor-not-allowed"
                >
                  Quên mật khẩu?
                </span>
              </div>

              {error && (
                <div className="p-3 bg-rust/10 border border-rust/30 text-rust text-xs rounded-md">
                  {error.response?.data?.message ||
                    "Tài khoản hoặc mật khẩu không chính xác."}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary  mt-1 disabled:opacity-50"
              >
                {isPending ? "Đang xử lý..." : "Đăng nhập"}
              </button>

              <div className="text-left pt-2">
                <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Chưa có tài khoản ?
                </span>
                <Link
                  to="/register"
                  className="text-xs font-bold text-green uppercase tracking-wide ml-1"
                >
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
