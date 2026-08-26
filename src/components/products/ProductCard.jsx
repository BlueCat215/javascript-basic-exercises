import { useCartStore } from "../../store/useCartStore";

export const ProductCard = ({ product, onEdit, onDelete }) => {
  const { id, title, price, image, category } = product;
  const addItem = useCartStore((state) => state.addItem);
  return (
    <article className="tag-card relative bg-white border border-line rounded-tag flex flex-col">
      <span
        className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-paper border border-line"
        aria-hidden="true"
      />

      <div className="p-4 flex-1 flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40 pl-4">
          {category || "Chưa phân loại"}
        </span>

        <div className="mt-3 h-28 flex items-center justify-center">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <h3 className="mt-3 font-display text-sm font-semibold text-ink leading-snug line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <span className="font-mono text-xl font-bold text-ink border-b-2 border-gold pb-0.5">
            ${price}
          </span>
          <span className="font-mono text-[10px] text-ink/30">#{id}</span>
        </div>
      </div>

      <div className="flex border-t border-line divide-x divide-line">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 py-2 text-xs font-medium text-ink hover:bg-paper transition-colors"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex-1 py-2 text-xs font-medium text-rust hover:bg-rust/5 transition-colors"
        >
          Xóa
        </button>
      </div>

      <div className="flex border-t border-line divide-x divide-line">
        <button
          onClick={() => addItem(product)}
          className="flex-1 py-2 text-xs font-medium text-ink hover:bg-paper transition-colors"
        >
          Thêm giỏ hàng
        </button>
      </div>
    </article>
  );
};
