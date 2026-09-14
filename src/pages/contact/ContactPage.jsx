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

const inputClass =
  "w-full text-sm rounded-md border border-line px-4 py-3 focus:border-green focus:ring-1 focus:ring-green outline-none";

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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      <Breadcrumb items={[{ label: "Liên hệ" }]} />

      <section className="bg-white rounded-xl border border-line p-6 md:p-10">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-ink uppercase mb-8">
          Liên hệ với chúng tôi
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-sm font-semibold text-ink/60 mb-6">
              Gửi câu hỏi hoặc góp ý cho chúng tôi
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Họ <span className="text-rust">*</span>
                  </label>
                  <input {...register("firstName")} className={inputClass} />
                  {errors.firstName && (
                    <p className="text-rust text-xs mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Tên <span className="text-rust">*</span>
                  </label>
                  <input {...register("lastName")} className={inputClass} />
                  {errors.lastName && (
                    <p className="text-rust text-xs mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Email <span className="text-rust">*</span>
                </label>
                <input {...register("email")} className={inputClass} />
                {errors.email && (
                  <p className="text-rust text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Số điện thoại{" "}
                  <span className="text-ink/40 font-normal">
                    (Không bắt buộc)
                  </span>
                </label>
                <input {...register("phone")} className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
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
                  <p className="text-rust text-xs mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Chủ đề{" "}
                  <span className="text-ink/40 font-normal">
                    (Không bắt buộc)
                  </span>
                </label>
                <input {...register("subject")} className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5">
                  Nội dung <span className="text-rust">*</span>
                </label>
                <textarea
                  {...register("message")}
                  rows={4}
                  placeholder="Nội dung liên hệ..."
                  className={inputClass}
                />
                {errors.message && (
                  <p className="text-rust text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agreeTerms")}
                  className="mt-0.5 rounded border-line text-green focus:ring-green"
                />
                <span className="text-xs text-ink/60 leading-normal">
                  Tôi đồng ý nhận thông tin cập nhật và đồng ý với{" "}
                  <a href="#" className="underline text-green">
                    Điều khoản sử dụng
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-rust text-xs">{errors.agreeTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary disabled:opacity-50"
              >
                {isPending ? "Đang gửi..." : "Gửi tin nhắn"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-paper rounded-xl p-6 md:p-8 border border-line text-xs text-ink space-y-4">
              <h3 className="text-[15px] font-bold tracking-widest text-ink uppercase">
                Thông tin liên hệ
              </h3>
              <div className="flex items-center gap-2">
                <PhoneIcon size={14} className="text-green" />
                <span className="font-semibold text-ink">1900 1234</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPinIcon size={14} className="text-green mt-0.5" />
                <span>218 Lĩnh Nam, Hoàng Mai, Hà Nội, Việt Nam</span>
              </div>
              <a
                href="mailto:support@minishop.example"
                className="text-green hover:underline block"
              >
                support@minishop.example
              </a>

              <div className="flex items-center gap-2.5 pt-2">
                {[FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-8 h-8 rounded-full bg-white border border-line flex items-center justify-center text-ink hover:text-green hover:border-green transition"
                    >
                      <Icon size={13} />
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-line p-6 md:p-10">
        <h2 className="text-xl font-display font-bold text-ink uppercase mb-6">
          Tìm chúng tôi trên bản đồ
        </h2>
        <div className="rounded-lg overflow-hidden border border-line h-[400px]">
          <iframe
            title="Bản đồ vị trí MiniShop"
            className="w-full h-full"
            loading="lazy"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.275018167857!2d105.87438479640961!3d20.981610150630242!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135afd765487289%3A0x21bd5839ba683d5f!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBLaW5oIFThur8gS-G7uSBUaHXhuq10IEPDtG5nIE5naGnhu4dw!5e0!3m2!1svi!2s!4v1789394641186!5m2!1svi!2s"
          />
        </div>
      </section>
    </div>
  );
}
