import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { contactSchema } from "../../schemas/contactSchema";
import { useContactMutation } from "./hooks/useContactMutation";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  PhoneIcon,
  MapPinIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
} from "../../components/icons";

const COUNTRIES = [
  { value: "VN", label: "Việt Nam" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "SG", label: "Singapore" },
];

// Giảm bo tròn xuống rounded, thiết kế phẳng, sắc nét
const inputClass =
  "w-full text-sm rounded border border-line px-4 py-3 focus:border-green focus:ring-1 focus:ring-green outline-none transition-colors bg-white";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSchema) });
  const { mutate: sendMessage, isPending } = useContactMutation();

  const onSubmit = (data) => {
    sendMessage(data, {
      onSuccess: () => {
        toast.success("Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.");
        reset();
      },
      onError: () => toast.error("Gửi liên hệ thất bại, vui lòng thử lại"),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      <Breadcrumb items={[{ label: "Liên hệ" }]} />
      <section className="bg-white rounded border border-line/80 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 md:p-10 order-2 lg:order-1 lg:border-r border-line/80">
            <h1 className="text-2xl md:text-3xl font-display font-bold text-ink uppercase mb-2">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-sm text-ink/60 mb-8">
              Điền vào biểu mẫu dưới đây và chúng tôi sẽ phản hồi bạn trong thời
              gian sớm nhất.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Họ <span className="text-rust">*</span>
                  </label>
                  <input {...register("firstName")} className={inputClass} />
                  {errors.firstName && (
                    <p className="text-rust text-xs mt-1.5">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Tên <span className="text-rust">*</span>
                  </label>
                  <input {...register("lastName")} className={inputClass} />
                  {errors.lastName && (
                    <p className="text-rust text-xs mt-1.5">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Email <span className="text-rust">*</span>
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-rust text-xs mt-1.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Số điện thoại{" "}
                    <span className="text-ink/40 font-normal normal-case">
                      (Không bắt buộc)
                    </span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Quốc gia <span className="text-rust">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className={inputClass}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Chọn quốc gia
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-rust text-xs mt-1.5">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Chủ đề{" "}
                  <span className="text-ink/40 font-normal normal-case">
                    (Không bắt buộc)
                  </span>
                </label>
                <input {...register("subject")} className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                  Nội dung <span className="text-rust">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  className={`${inputClass} resize-y min-h-30`}
                />
                {errors.message && (
                  <p className="text-rust text-xs mt-1.5">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="mt-0.5 rounded-sm border-line text-green focus:ring-green shrink-0"
                  />
                  <span className="text-sm text-ink/70 leading-snug">
                    Tôi đồng ý nhận thông tin cập nhật và đồng ý với{" "}
                    <a
                      href="#"
                      className="underline text-ink hover:text-green transition-colors font-medium"
                    >
                      Điều khoản sử dụng
                    </a>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-rust text-xs mt-1.5">
                    {errors.agreeTerms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full sm:w-auto px-10 py-3 bg-ink hover:bg-ink/80 text-white text-sm font-bold uppercase tracking-wider rounded transition-colors disabled:opacity-50 mt-2"
              >
                {isPending ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </div>

          {/* Cột Thông tin liên hệ (Bên phải) */}
          <div className="lg:col-span-4 p-6 md:p-10 bg-neutral-50/50 order-1 lg:order-2 border-b lg:border-b-0 border-line/80 flex flex-col">
            <h3 className="text-lg font-display font-bold text-ink uppercase mb-8">
              Thông tin liên hệ
            </h3>

            <div className="space-y-6 flex-1">
              <div>
                <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1.5">
                  Hotline
                </p>
                <div className="flex items-center gap-2">
                  <PhoneIcon size={18} className="text-ink" />
                  <span className="font-bold text-ink text-lg">1900 1234</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1.5">
                  Địa chỉ
                </p>
                <div className="flex items-start gap-2 text-ink">
                  <MapPinIcon size={18} className="mt-0.5 shrink-0" />
                  <span className="leading-relaxed">
                    218 Lĩnh Nam, Hoàng Mai
                    <br />
                    Hà Nội, Việt Nam
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-1.5">
                  Email hỗ trợ
                </p>
                <div className="flex items-center gap-2 text-ink">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <a
                    href="mailto:support@minishop.example"
                    className="hover:underline font-medium hover:text-green transition-colors"
                  >
                    support@minishop.example
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-line/60">
              <p className="text-xs font-bold text-ink/50 uppercase tracking-wider mb-4">
                Kết nối
              </p>
              <div className="flex items-center gap-4">
                {[FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-ink hover:text-green transition-colors"
                    >
                      <Icon size={20} />
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-75 sm:h-112 border-t border-line/80 bg-neutral-100">
          <iframe
            title="Bản đồ vị trí MiniShop"
            className="w-full h-full border-0 grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.275018167857!2d105.87438479640961!3d20.981610150630242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135afd765487289%3A0x21bd5839ba683d5f!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaW5oIFThur8gS-G7uSBUaHXhuq10IEPDtG5nIE5naGnhu4dw!5e0!3m2!1svi!2s!4v1789394641186!5m2!1svi!2s"
          />
        </div>
      </section>
    </div>
  );
}
