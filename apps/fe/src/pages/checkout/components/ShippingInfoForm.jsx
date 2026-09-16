import { Field, inputClass } from "./Field";

const COUNTRIES = [
  { value: "VN", label: "Việt Nam" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "JP", label: "Japan" },
];

export const ShippingInfoForm = ({ register, errors }) => {
  return (
    <div className="lg:col-span-7 space-y-6">
      <div>
        <h2 className="text-base font-bold text-ink uppercase tracking-wider mb-6 pb-2 border-b border-line">
          1. Thông tin nhận hàng
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

          <Field label="Quốc gia" required error={errors.country?.message}>
            <select {...register("country")} className={inputClass}>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="space-y-3">
            <Field label="Địa chỉ" required error={errors.street?.message}>
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
            <Field label="Thành phố" required error={errors.city?.message}>
              <input
                {...register("city")}
                placeholder="VD: Hà Nội"
                className={inputClass}
              />
            </Field>
            <Field label="Tỉnh/Thành" required error={errors.state?.message}>
              <input
                {...register("state")}
                placeholder="VD: Hà Nội"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Mã bưu điện" required error={errors.zipCode?.message}>
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
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">
            Ghi chú đơn hàng
          </h3>
          <Field error={errors.orderNotes?.message}>
            <textarea
              {...register("orderNotes")}
              rows={4}
              placeholder="Ghi chú giao hàng, yêu cầu đặc biệt..."
              className={`${inputClass} resize-y min-h-25`}
            />
          </Field>
        </div>
      </div>
    </div>
  );
};
