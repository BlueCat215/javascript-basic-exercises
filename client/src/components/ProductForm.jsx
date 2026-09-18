import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { imageUrl } from "../utils/imageUrl";

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

export const ProductForm = ({ onUpload }) => {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const images = watch("images") ?? [];

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = 6 - images.length;
    if (remaining <= 0) {
      setUploadError("Đã đạt tối đa 6 ảnh");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const result = await onUpload(files.slice(0, remaining));
      setValue("images", [...images, ...result.images], {
        shouldValidate: true,
      });
    } catch (err) {
      setUploadError(err?.response?.data?.message ?? "Upload thất bại");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      { shouldValidate: true },
    );
  };

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

      <div className="block w-full">
        <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-ink/60 mb-1.5 leading-relaxed">
          Ảnh sản phẩm ({images.length}/6)
        </span>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((src, i) => (
              <div
                key={i}
                className="relative w-20 h-24 rounded-lg border border-line bg-neutral-50 shrink-0 group"
              >
                <img
                  src={imageUrl(src)}
                  alt={`Ảnh ${i + 1}`}
                  className="w-full h-full object-contain p-1.5 rounded-lg mix-blend-multiply"
                />
                {i === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[9px] font-bold bg-ink text-white rounded-b-lg py-0.5">
                    Đại diện
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-rust text-white rounded-full text-xs leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Xoá ảnh"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length < 6 && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 border border-dashed border-line hover:border-gold text-ink/50 hover:text-gold text-sm px-4 py-2.5 rounded-tag transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                  Đang tải lên…
                </>
              ) : (
                <>
                  <span className="text-lg leading-none">+</span>
                  Chọn ảnh
                </>
              )}
            </button>
            <p className="text-[11px] text-ink/40 mt-1.5">
              Tối đa 6 ảnh · Mỗi ảnh ≤ 3MB · jpeg, png, webp, gif, avif · Ảnh
              đầu tiên là ảnh đại diện
            </p>
          </div>
        )}

        {uploadError && (
          <p className="text-rust text-xs mt-1.5 font-medium">{uploadError}</p>
        )}

        {errors.images?.message && (
          <p className="text-rust text-xs mt-1.5 font-medium">
            {errors.images.message}
          </p>
        )}
      </div>

      <Field label="Số lượng trong kho" error={errors.stock?.message}>
        <input
          className={`${inputClass} font-mono`}
          type="number"
          min="0"
          step="1"
          placeholder="0"
          {...register("stock")}
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
      </div>
    </div>
  );
};
