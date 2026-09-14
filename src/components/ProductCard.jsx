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
  const {
    id,
    title,
    price,
    image,
    category,
    rating,
    originalPrice,
    purchases,
    isNew,
    inStock,
  } = product;
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { mutate: addToCart, isPending } = useAddToCart();
  const isFavorite = useIsFavorite(id);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

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
    <div className="tag-card group relative bg-white border border-line rounded-lg p-3 flex flex-col h-full">
      <Link
        to={`/products/${id}`}
        className="flex flex-col items-center flex-1 text-center"
      >
        <h3 className="text-sm font-semibold text-ink line-clamp-2 h-10 leading-tight mt-1 mb-1 w-full text-center content-center">
          {title}
        </h3>

        {rating ? (
          <div className="flex items-center justify-center gap-1 mb-2 w-full h-4 shrink-0">
            <div className="flex items-center gap-0.5">
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
            </div>
            <span className="text-ink/40 text-[10px]">({rating.count})</span>
          </div>
        ) : (
          <div className="mb-2 h-4 shrink-0" />
        )}

        <div className="relative w-full h-44 rounded-md overflow-hidden mb-3 flex items-center justify-center shrink-0">
          {(isNew || inStock === false) && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase px-2 py-1 rounded bg-ink text-white">
              {inStock === false ? "Hết hàng" : "Mới"}
            </span>
          )}
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="max-w-full max-h-full object-contain p-4 group-hover:scale-105 transition duration-300"
          />
        </div>

        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/40 line-clamp-1 w-full chunks-0">
          {category}
        </p>

        <div className="mt-auto pt-1 flex items-center justify-center gap-2 w-full flex-wrap">
          <span className="font-display text-lg font-bold text-green">
            ${price}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-ink/40 line-through">
                ${originalPrice}
              </span>
              <span className="bg-rust text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
                Giảm {discountPercent}%
              </span>
            </>
          )}
        </div>
        {purchases ? (
          <p className="text-[10px] text-ink/40 mt-1">Đã mua: {purchases}</p>
        ) : null}
      </Link>

      <div className="mt-3 pt-3  flex items-center justify-between dynamic-actions shrink-0">
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
        <div className="flex gap-2 mt-2 pt-2 border-t border-line shrink-0">
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
