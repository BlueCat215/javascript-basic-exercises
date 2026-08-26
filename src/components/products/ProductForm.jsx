const Field = ({ label, children }) => {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
};

const inputClass =
  "w-full border border-line bg-white px-3 py-2 text-sm rounded-tag focus:outline-none focus:border-gold transition-colors";

export const ProductForm = ({ form, onChange }) => {
  return (
    <div className="space-y-4">
      <Field label="Tên sản phẩm">
        <input
          className={inputClass}
          name="title"
          value={form.title}
          onChange={onChange}
          placeholder="VD: Áo khoác denim"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Giá ($)">
          <input
            className={`${inputClass} font-mono`}
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="0"
          />
        </Field>
        <Field label="Danh mục">
          <input
            className={inputClass}
            name="category"
            value={form.category}
            onChange={onChange}
            placeholder="VD: Thời trang"
          />
        </Field>
      </div>

      <Field label="Ảnh (URL)">
        <input
          className={inputClass}
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="https://…"
        />
      </Field>

      <Field label="Mô tả">
        <textarea
          className={inputClass}
          name="description"
          rows={4}
          value={form.description}
          onChange={onChange}
          placeholder="Mô tả ngắn về sản phẩm…"
        />
      </Field>
    </div>
  );
};
