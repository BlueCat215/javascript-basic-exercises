import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { register as registerApi } from "../../api/services/authService";
import { registerSchema } from "../../schemas/registerSchema";
import { Breadcrumb } from "../../components/Breadcrumb";
import { AuthSidePanel } from "../../components/AuthSidePanel";

const PasswordInput = ({ register, name, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name)}
          placeholder={placeholder}
          className="w-full text-xs text-ink border border-line rounded-md py-3 pl-3.5 pr-10 focus:border-green focus:ring-1 focus:ring-green outline-none"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-ink/40 hover:text-ink/70 text-xs font-semibold"
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
      {error && <p className="text-rust text-xs mt-1">{error}</p>}
    </div>
  );
};

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
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb items={[{ label: "Đăng ký" }]} />

      <div className="bg-white rounded-2xl border border-line p-8 sm:p-14 md:p-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <AuthSidePanel
            title="Chào mừng đến MiniShop"
            subtitle="Tạo tài khoản để trải nghiệm mua sắm trọn vẹn hơn"
          />
          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:mx-0">
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-green mb-1">
                Đăng ký
              </h1>
              <p className="text-xs font-semibold text-ink/40 tracking-widest uppercase">
                Tham gia cùng chúng tôi
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5">
                  Tên đăng nhập
                </label>
                <input
                  {...register("username")}
                  placeholder="VD: nguyenhieu"
                  className="w-full text-xs text-ink border border-line rounded-md py-3 px-3.5 focus:border-green focus:ring-1 focus:ring-green outline-none"
                />
                {errors.username && (
                  <p className="text-rust text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5">
                  Email
                </label>
                <input
                  {...register("email")}
                  placeholder="VD: ban@email.com"
                  className="w-full text-xs text-ink border border-line rounded-md py-3 px-3.5 focus:border-green focus:ring-1 focus:ring-green outline-none"
                />
                {errors.email && (
                  <p className="text-rust text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5">
                  Mật khẩu
                </label>
                <PasswordInput
                  register={register}
                  name="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-ink/70 mb-1.5">
                  Nhập lại mật khẩu
                </label>
                <PasswordInput
                  register={register}
                  name="confirmPassword"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full mt-2 disabled:opacity-50"
              >
                {isPending ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-ink/50">Đã có tài khoản? </span>
                <Link
                  to="/login"
                  className="text-xs font-bold text-green hover:underline uppercase tracking-wide"
                >
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
