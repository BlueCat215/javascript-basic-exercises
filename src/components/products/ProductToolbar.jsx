import { CartBadge } from "../cart/CartBadge"; // Thêm dòng import này

export const ProductToolbar = ({
  query,
  onQueryChange,
  onCreate,
  total,
  onOpenCart,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-line">
      {/* Khối tiêu đề bên trái */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink/40">
          Kho hàng · {total} sản phẩm
        </p>
        <h1 className="font-display text-3xl font-semibold text-ink mt-1">
          Danh sách sản phẩm
        </h1>
      </div>

      {/* Khối điều khiển bên phải (Tìm kiếm + Thêm mới + Giỏ hàng) */}
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto">
        {/* Ô Tìm kiếm */}
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Tìm theo tên hoặc danh mục…"
          className="w-full sm:flex-1 md:w-64 border border-line bg-white px-3 py-2 text-sm rounded-tag focus:outline-none focus:border-gold transition-colors"
        />

        {/* Nhóm nút hành động */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={onCreate}
            className="btn-primary flex-1 sm:flex-none whitespace-nowrap"
          >
            + Thêm mới
          </button>

          {/* Nút Giỏ hàng được tích hợp trực tiếp, co giãn chuẩn theo mobile */}
          <div className="shrink-0">
            <CartBadge onClick={onOpenCart} />
          </div>
        </div>
      </div>
    </div>
  );
};
