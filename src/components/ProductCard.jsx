import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useAddToCart } from "../pages/cart/hooks/useCartQueries";
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from "../pages/account/hooks/useFavoriteQueries";
import { HeartIcon, StarIcon } from "./icons";

export const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => {
  const { id, title, price, image, category, rating } = product;
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { mutate: addToCart, isPending } = useAddToCart();
  const isFavorite = useIsFavorite(id);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const requireAuth = () => {
    toast.error("Vui lòng đăng nhập");
    navigate("/login", { state: { from: location } });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return requireAuth();
    addToCart(
      { productId: id, quantity: 1 },
      { onSuccess: () => toast.success("Đã thêm vào giỏ hàng") },
    );
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return requireAuth();
    if (isFavorite) removeFavorite(id);
    else addFavorite({ productId: id, product });
  };

  return (
    <div className="tag-card group relative bg-white border border-line rounded-lg p-3">
      <Link to={`/products/${id}`}>
        <div className="w-full h-44 rounded-md bg-paper overflow-hidden mb-3">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
          />
        </div>

        {rating && (
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                size={12}
                className={
                  i < Math.round(rating.rate)
                    ? "fill-gold text-gold"
                    : "text-line"
                }
              />
            ))}
            <span className="text-ink/40 text-[10px] ml-1">
              ({rating.count})
            </span>
          </div>
        )}

        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
          {category}
        </p>
        <h3 className="text-sm font-semibold text-ink line-clamp-2 h-10 leading-tight mt-1">
          {title}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-green">
            ${price}
          </span>
        </div>
      </Link>

      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between">
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className="text-xs font-semibold text-green hover:text-green-light disabled:opacity-50"
        >
          {isPending ? "Đang thêm..." : "+ Giỏ hàng"}
        </button>
        <button
          onClick={handleToggleFavorite}
          aria-label="Yêu thích"
          className="transition"
        >
          <HeartIcon
            size={20}
            className={
              isFavorite ? "fill-rust text-rust" : "text-ink/30 hover:text-rust"
            }
          />
        </button>
      </div>

      {isAdmin && (
        <div className="flex gap-2 mt-2 pt-2 border-t border-line">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 text-xs text-gold hover:underline"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 text-xs text-rust hover:underline"
          >
            Xóa
          </button>
        </div>
      )}
    </div>
  );
};
