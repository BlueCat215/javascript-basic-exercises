import { Link } from "react-router-dom";
import { useActiveCart } from "../../pages/cart/hooks/useCartQueries";
import { useAuthStore } from "../../store/useAuthStore";

export const CartBadge = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart } = useActiveCart({ enabled: isAuthenticated });
  const totalItems =
    cart?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <Link
      to="/cart"
      className="relative flex items-center gap-2 px-4 py-2 border border-line rounded-tag bg-white hover:bg-paper text-sm font-medium"
    >
      <span>Giỏ hàng</span>
      {isAuthenticated && totalItems > 0 && (
        <span className="bg-gold text-white text-xs w-5 h-5 rounded-full grid place-items-center">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
