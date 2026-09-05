import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register as registerApi } from "../../api/services/authService";
import { registerSchema } from "../../schemas/registerSchema";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => registerApi(data),
    onSuccess: () => {
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Đăng ký thất bại"),
  });

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    mutate(payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper py-12 px-4">
      <div className="max-w-sm w-full bg-surface p-8 rounded-tag border border-line space-y-6">
        <h1 className="text-2xl font-display font-bold text-ink text-center">
          Đăng ký
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
              {...register("email")}
              placeholder="Email"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.email && (
              <p className="text-rust text-xs mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("password")}
              placeholder="Mật khẩu"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.password && (
              <p className="text-rust text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="Nhập lại mật khẩu"
              className="w-full border border-line rounded-tag px-4 py-2.5"
            />
            {errors.confirmPassword && (
              <p className="text-rust text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isPending ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        <p className="text-center text-sm text-ink/60">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-gold hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
