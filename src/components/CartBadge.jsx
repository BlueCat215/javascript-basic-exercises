import { Link } from "react-router-dom";
import { useActiveCart } from "../pages/cart/hooks/useCartQueries";
import { useAuthStore } from "../store/useAuthStore";
import { CartIcon } from "./icons";

export const CartBadge = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart } = useActiveCart({ enabled: isAuthenticated });
  const totalItems =
    cart?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <Link
      to="/cart"
      className="relative flex items-center gap-2 px-4 py-2 border border-line rounded-full bg-white hover:bg-paper"
    >
      <CartIcon size={20} className="text-ink" />
      {isAuthenticated && totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-[10px] w-5 h-5 rounded-full grid place-items-center font-semibold">
          {totalItems}
        </span>
      )}
    </Link>
  );
};
