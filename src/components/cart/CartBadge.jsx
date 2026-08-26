import { useCartStore } from "../../store/useCartStore";

export const CartBadge = ({ onClick }) => {
  const hasHydrated = useCartStore((state) => state._hasHydrated);
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <button
      onClick={onClick}
      className="group relative flex items-center gap-2 px-4 py-2 border border-line rounded-tag bg-white hover:bg-paper hover:border-ink/20 text-ink text-sm font-medium transition-all duration-200 active:scale-95 shadow-sm"
      aria-label="Giỏ hàng"
    >
      <span>Giỏ hàng</span>

      {hasHydrated && totalItems > 0 && <span>{totalItems}</span>}
    </button>
  );
};
