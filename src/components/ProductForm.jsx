import { useFormContext } from "react-hook-form";

const Field = ({ label, children, error }) => (
  <label className="block">
    <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
      {label}
    </span>
    <div className="mt-1.5">{children}</div>
    {error && <p className="text-rust text-xs mt-1">{error}</p>}
  </label>
);

const inputClass =
  "w-full border border-line bg-white px-3 py-2 text-sm rounded-tag focus:outline-none focus:border-gold transition-colors";

export const ProductForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <Field label="Tên sản phẩm" error={errors.title?.message}>
        <input
          className={inputClass}
          placeholder="VD: Áo khoác denim"
          {...register("title")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Giá ($)" error={errors.price?.message}>
          <input
            className={`${inputClass} font-mono`}
            type="number"
            step="0.01"
            placeholder="0"
            {...register("price")}
          />
        </Field>
        <Field label="Danh mục" error={errors.category?.message}>
          <input
            className={inputClass}
            placeholder="VD: Thời trang"
            {...register("category")}
          />
        </Field>
      </div>

      <Field label="Ảnh (URL)" error={errors.image?.message}>
        <input
          className={inputClass}
          placeholder="https://…"
          {...register("image")}
        />
      </Field>

      <Field label="Mô tả" error={errors.description?.message}>
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Mô tả ngắn về sản phẩm…"
          {...register("description")}
        />
      </Field>
    </div>
  );
};
