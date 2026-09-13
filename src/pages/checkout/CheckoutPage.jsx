import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useActiveCart } from "../cart/hooks/useCartQueries";
import { useCheckout } from "./hooks/useCheckout";
import { checkoutSchema } from "../../schemas/checkoutSchema";
import { Breadcrumb } from "../../components/Breadcrumb";

const COUNTRIES = [
  { value: "VN", label: "Việt Nam" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "JP", label: "Japan" },
];

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-ink/70 mb-1.5">
      {label} {required && <span className="text-rust">*</span>}
    </label>
    {children}
    {error && <p className="text-rust text-[11px] mt-1">{error}</p>}
  </div>
);

const inputClass =
  "w-full text-xs rounded border border-line py-2.5 px-3 focus:border-green focus:ring-1 focus:ring-green outline-none bg-white";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const voucher = location.state?.voucher || null;

  const { data: cart } = useActiveCart();
  const { mutate: checkout, isPending } = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { country: "VN", paymentMethod: "cod" },
  });

  const items = cart?.products || [];
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0,
  );
  const discount = voucher ? (subtotal * voucher.discountPercent) / 100 : 0;
  const total = subtotal - discount;

  const onSubmit = (formData) => {
    checkout(
      {
        shippingInfo: {
          fullName: `${formData.firstName} ${formData.lastName}`,
          company: formData.company || undefined,
          country: formData.country,
          street: formData.street,
          streetOptional: formData.streetOptional || undefined,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone,
          email: formData.email,
          notes: formData.orderNotes || undefined,
        },
        paymentMethod: formData.paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success("Đặt hàng thành công!");
          navigate("/account/orders");
        },
        onError: () => toast.error("Đặt hàng thất bại, vui lòng thử lại"),
      },
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <p className="text-ink/50 mb-4">
          Giỏ hàng trống, không thể thanh toán.
        </p>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <Breadcrumb
        items={[{ to: "/cart", label: "Giỏ hàng" }, { label: "Thanh toán" }]}
      />

      <div className="bg-white rounded-xl border border-line p-6 sm:p-10">
        <h1 className="text-2xl font-display font-bold text-ink mb-8 uppercase">
          Thanh toán
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10"
        >
          {/* CỘT TRÁI */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-base font-bold text-ink mb-6 pb-2 border-b border-line">
                Thông tin nhận hàng
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Họ" required error={errors.firstName?.message}>
                    <input
                      {...register("firstName")}
                      placeholder="VD: Nguyễn"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Tên" required error={errors.lastName?.message}>
                    <input
                      {...register("lastName")}
                      placeholder="VD: Hiếu"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Công ty" error={errors.company?.message}>
                  <input
                    {...register("company")}
                    placeholder="(Không bắt buộc)"
                    className={inputClass}
                  />
                </Field>

                <Field
                  label="Quốc gia"
                  required
                  error={errors.country?.message}
                >
                  <select {...register("country")} className={inputClass}>
                    {COUNTRIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="space-y-2">
                  <Field
                    label="Địa chỉ"
                    required
                    error={errors.street?.message}
                  >
                    <input
                      {...register("street")}
                      placeholder="Số nhà, tên đường..."
                      className={inputClass}
                    />
                  </Field>
                  <input
                    {...register("streetOptional")}
                    placeholder="Căn hộ, tầng... (không bắt buộc)"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Thành phố"
                    required
                    error={errors.city?.message}
                  >
                    <input
                      {...register("city")}
                      placeholder="VD: Hà Nội"
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    label="Tỉnh/Thành"
                    required
                    error={errors.state?.message}
                  >
                    <input
                      {...register("state")}
                      placeholder="VD: Hà Nội"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field
                  label="Mã bưu điện"
                  required
                  error={errors.zipCode?.message}
                >
                  <input
                    {...register("zipCode")}
                    placeholder="VD: 100000"
                    className={inputClass}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Số điện thoại"
                    required
                    error={errors.phone?.message}
                  >
                    <input
                      {...register("phone")}
                      placeholder="VD: 0912345678"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Email" required error={errors.email?.message}>
                    <input
                      {...register("email")}
                      placeholder="VD: ban@email.com"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-line">
                <h3 className="text-sm font-bold text-ink mb-3">
                  Thông tin thêm
                </h3>
                <Field
                  label="Ghi chú đơn hàng"
                  error={errors.orderNotes?.message}
                >
                  <textarea
                    {...register("orderNotes")}
                    rows={4}
                    placeholder="Ghi chú giao hàng, yêu cầu đặc biệt..."
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI */}
          <div className="lg:col-span-5">
            <h2 className="text-base font-bold text-ink mb-6">
              Đơn hàng của bạn
            </h2>
            <div className="bg-paper rounded-xl p-6 border border-line">
              <div className="flex justify-between items-center pb-3 border-b border-line text-[11px] font-bold tracking-wider text-ink/40 uppercase">
                <span>Sản phẩm</span>
                <span>Tạm tính</span>
              </div>

              <div className="py-4 border-b border-line space-y-3">
                {items.map((i) => (
                  <div
                    key={i.productId}
                    className="flex items-start justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={i.product?.image}
                        alt={i.product?.title}
                        className="w-12 h-12 object-contain rounded border border-line bg-white shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-ink leading-snug line-clamp-1">
                          {i.product?.title}
                        </h4>
                        <span className="text-xs text-ink/40 block mt-0.5">
                          x {i.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-ink text-right whitespace-nowrap pt-1">
                      ${(i.product?.price * i.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="py-3 flex justify-between items-center text-xs border-b border-line">
                <span className="text-ink/60 font-medium">Tạm tính</span>
                <span className="font-semibold text-ink">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              {voucher && (
                <div className="py-3 flex justify-between items-center text-xs border-b border-line">
                  <span className="text-ink/60 font-medium">
                    Giảm giá ({voucher.code})
                  </span>
                  <span className="font-semibold text-green">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="py-4 flex justify-between items-center border-b border-line">
                <span className="text-sm font-bold text-ink">Tổng cộng</span>
                <span className="text-lg font-display font-bold text-green">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="pt-5 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white/60 p-3 rounded-lg border border-line">
                  <input
                    type="radio"
                    value="cod"
                    {...register("paymentMethod")}
                    className="text-green focus:ring-green h-4 w-4"
                  />
                  <span className="text-xs font-bold text-ink">
                    Thanh toán khi nhận hàng (COD)
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer bg-white/60 p-3 rounded-lg border border-line">
                  <input
                    type="radio"
                    value="bank_transfer"
                    {...register("paymentMethod")}
                    className="text-green focus:ring-green h-4 w-4"
                  />
                  <span className="text-xs font-bold text-ink">
                    Chuyển khoản ngân hàng
                  </span>
                </label>
                {errors.paymentMethod && (
                  <p className="text-rust text-[11px]">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full mt-6 disabled:opacity-50"
              >
                {isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
