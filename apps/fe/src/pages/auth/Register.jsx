import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { register as registerApi } from "../../api/services/authService";
import { registerSchema } from "../../schemas/registerSchema";
import { Breadcrumb } from "../../components/Breadcrumb";

const PasswordInput = ({ register, name, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name)}
          placeholder={placeholder}
          className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-line rounded-md text-base sm:text-sm text-ink placeholder:text-ink/40 pr-14 focus:border-green focus:ring-1 focus:ring-green outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-ink/50 hover:text-ink text-xs font-semibold touch-manipulation select-none"
        >
          {show ? "Ẩn" : "Hiện"}
        </button>
      </div>
      {error && <p className="text-rust text-xs mt-1 font-medium">{error}</p>}
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <Breadcrumb items={[{ label: "Đăng ký" }]} />

      <div className="bg-white rounded-xl sm:rounded-2xl border border-line p-5 sm:p-10 md:p-14 lg:p-16 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="hidden lg:flex lg:col-span-6 justify-center items-center">
            <img
              src="/login.svg"
              alt="Register Illustration"
              className="w-full max-h-96 object-contain"
            />
          </div>

          <div className="lg:col-span-6 w-full max-w-md mx-auto lg:mx-0">
            <div className="mb-6 sm:mb-7 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-green">
                Đăng ký
              </h1>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-ink/50 mt-1.5">
                Tham gia cùng chúng tôi
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink text-left">
                  Tên đăng nhập
                </label>
                <input
                  {...register("username")}
                  placeholder="VD: nguyenhieu"
                  className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-line rounded-md text-base sm:text-sm text-ink placeholder:text-ink/40 focus:border-green focus:ring-1 focus:ring-green outline-none transition-all"
                />
                {errors.username && (
                  <p className="text-rust text-xs mt-1 text-left font-medium">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink text-left">
                  Email
                </label>
                <input
                  {...register("email")}
                  placeholder="VD: ban@email.com"
                  className="w-full px-3.5 sm:px-4 py-2.5 bg-white border border-line rounded-md text-base sm:text-sm text-ink placeholder:text-ink/40 focus:border-green focus:ring-1 focus:ring-green outline-none transition-all"
                />
                {errors.email && (
                  <p className="text-rust text-xs mt-1 text-left font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink text-left">
                  Mật khẩu
                </label>
                <PasswordInput
                  register={register}
                  name="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-ink text-left">
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
                className="w-full py-3 px-4 btn-primary mt-1 disabled:opacity-50 active:scale-[0.99] transition-transform font-bold"
              >
                {isPending ? "Đang xử lý..." : "Đăng ký"}
              </button>

              <div className="text-center sm:text-left pt-2 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                  Đã có tài khoản?
                </span>
                <Link
                  to="/login"
                  className="text-xs font-bold text-green uppercase tracking-wide hover:underline"
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
