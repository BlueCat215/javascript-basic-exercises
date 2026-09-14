import { Link } from "react-router-dom";
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from "../../../pages/account/hooks/useFavoriteQueries";
import { useAuthStore } from "../../../store/useAuthStore";
import { HeartIcon, StarIcon } from "../../../components/icons";

const formatPurchases = (n) => {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${n}`;
};

export const HomeProductCard = ({ product }) => {
  const {
    id,
    title,
    price,
    image,
    rating,
    originalPrice,
    purchases,
    isNew,
    inStock,
  } = product;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useIsFavorite(id);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    if (isFavorite) removeFavorite(id);
    else addFavorite({ productId: id, product });
  };

  return (
    <Link
      to={`/products/${id}`}
      className="tag-card group bg-white border border-line rounded-lg p-3 flex flex-col h-full text-left"
    >
      <h3 className="text-sm font-semibold text-ink line-clamp-2 h-10 leading-tight mb-1">
        {title}
      </h3>

      {rating?.count ? (
        <div className="flex items-center gap-1 mb-2 h-4">
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
        <div className="mb-2 h-4" />
      )}

      <div className="relative w-full h-44 rounded-md overflow-hidden mb-3 flex items-center justify-center shrink-0 bg-paper">
        {(isNew || !inStock) && (
          <span
            className={`absolute top-2 left-2 z-10 text-[10px] font-bold uppercase px-2 py-1 rounded ${
              !inStock ? "bg-ink text-white" : "bg-ink text-white"
            }`}
          >
            {!inStock ? "Out of stock" : "New"}
          </span>
        )}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="max-w-full max-h-full object-contain p-4 group-hover:scale-105 transition duration-300"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-display text-base font-bold text-rust">
          ${price}
        </span>
        {hasDiscount && (
          <>
            <span className="text-xs text-ink/40 line-through">
              ${originalPrice}
            </span>
            <span className="bg-rust text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase">
              {discountPercent}% off
            </span>
          </>
        )}
      </div>

      <div className="mt-3 pt-3 flex items-center justify-between shrink-0">
        <span className="text-xs text-ink/50">
          {formatPurchases(purchases)} Purchases
        </span>
        <button
          onClick={handleToggleFavorite}
          aria-label="Yêu thích"
          className="transition"
        >
          <HeartIcon
            size={18}
            className={
              isFavorite ? "fill-rust text-rust" : "text-ink/30 hover:text-rust"
            }
          />
        </button>
      </div>
    </Link>
  );
};
