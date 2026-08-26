import { useCartStore } from "../../store/useCartStore";

export const CartDrawer = ({ isOpen, onClose }) => {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.totalPrice);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white border-l border-line shadow-2xl flex flex-col
          transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-lg font-semibold text-ink">
            Giỏ hàng ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-full hover:bg-paper"
          >
            Thoát
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 && (
            <p className="text-sm text-ink/50 text-center py-10">
              Giỏ hàng trống
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 border-b border-line pb-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-14 h-14 object-contain"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink line-clamp-1">
                  {item.title}
                </p>
                <p className="font-mono text-sm text-ink/60 mt-0.5">
                  ${item.price}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 border border-line rounded text-xs"
                  >
                    −
                  </button>
                  <span className="text-sm font-mono w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 border border-line rounded text-xs"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-xs text-rust hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <footer className="px-6 py-4 border-t border-line space-y-3">
            <div className="flex justify-between font-mono text-sm">
              <span>Tổng cộng</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={clearCart} className="btn-secondary flex-1">
                Xóa hết
              </button>
              <button className="btn-primary flex-1">Thanh toán</button>
            </div>
          </footer>
        )}
      </aside>
    </div>
  );
};
