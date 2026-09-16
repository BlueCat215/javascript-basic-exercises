import { useFormContext } from "react-hook-form";

const Field = ({ label, children, error }) => (
  <label className="block w-full">
    <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/60 mb-1.5 leading-relaxed">
      {label}
    </span>
    <div className="relative">{children}</div>
    {error && (
      <p className="text-rust text-xs sm:text-[13px] mt-1.5 font-medium animate-pulse motion-reduce:animate-none">
        {error}
      </p>
    )}
  </label>
);

const inputClass =
  "w-full border border-line bg-white px-3 sm:px-4 py-2.5 sm:py-2 text-base sm:text-sm rounded-tag focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-ink/30";

export const ProductForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      <Field label="Tên sản phẩm" error={errors.title?.message}>
        <input
          className={inputClass}
          placeholder="VD: Áo khoác denim"
          {...register("title")}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
        <Field label="Giá ($)" error={errors.price?.message}>
          <input
            className={`${inputClass} font-mono`}
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("price")}
          />
        </Field>
        <Field
          label="Giá gốc ($) — Bỏ trống nếu không giảm"
          error={errors.originalPrice?.message}
        >
          <input
            className={`${inputClass} font-mono`}
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("originalPrice")}
          />
        </Field>
      </div>

      <Field label="Danh mục" error={errors.category?.message}>
        <input
          className={inputClass}
          placeholder="VD: Thời trang"
          {...register("category")}
        />
      </Field>

      <Field label="Ảnh (URL)" error={errors.image?.message}>
        <input
          className={inputClass}
          type="url"
          placeholder="https://…"
          {...register("image")}
        />
      </Field>

      <Field label="Mô tả" error={errors.description?.message}>
        <textarea
          className={`${inputClass} resize-y min-h-25 sm:min-h-30`}
          rows={4}
          placeholder="Mô tả ngắn về sản phẩm…"
          {...register("description")}
        />
      </Field>

      <div className="flex flex-wrap gap-x-5 gap-y-3 sm:gap-6 pt-2">
        <label className="flex items-center gap-2.5 text-sm sm:text-[15px] cursor-pointer select-none group py-1">
          <input
            type="checkbox"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded border-line text-green focus:ring-green/40 transition-colors cursor-pointer"
            {...register("isNew")}
          />
          <span className="group-hover:text-green transition-colors text-ink">
            Sản phẩm mới
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-sm sm:text-[15px] cursor-pointer select-none group py-1">
          <input
            type="checkbox"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded border-line text-green focus:ring-green/40 transition-colors cursor-pointer"
            {...register("isBestSeller")}
          />
          <span className="group-hover:text-green transition-colors text-ink">
            Bán chạy
          </span>
        </label>

        <label className="flex items-center gap-2.5 text-sm sm:text-[15px] cursor-pointer select-none group py-1">
          <input
            type="checkbox"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded border-line text-green focus:ring-green/40 transition-colors cursor-pointer"
            {...register("inStock")}
          />
          <span className="group-hover:text-green transition-colors text-ink">
            Còn hàng
          </span>
        </label>
      </div>
    </div>
  );
};
