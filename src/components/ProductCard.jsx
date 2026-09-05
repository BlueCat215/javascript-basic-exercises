import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useAddToCart } from "../pages/cart/hooks/useCartQueries";

export const ProductCard = ({ product, onEdit, onDelete, isAdmin }) => {
  const { id, title, price, image, category } = product;
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login", { state: { from: location } });
      return;
    }
    addToCart(
      { productId: id, quantity: 1 },
      { onSuccess: () => toast.success("Đã thêm vào giỏ hàng") },
    );
  };

  return (
    <article className="tag-card relative bg-white border border-line rounded-tag flex flex-col">
      <Link to={`/products/${id}`} className="p-4 flex-1 flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
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
      </Link>

      {isAdmin && (
        <div className="flex border-t border-line divide-x divide-line">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2 text-xs font-medium text-ink hover:bg-paper"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(id)}
            className="flex-1 py-2 text-xs font-medium text-rust hover:bg-rust/5"
          >
            Xóa
          </button>
        </div>
      )}

      <div className="flex border-t border-line divide-x divide-line">
        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className="flex-1 py-2 text-xs font-medium text-ink hover:bg-paper disabled:opacity-50"
        >
          {isPending ? "Đang thêm..." : "Thêm giỏ hàng"}
        </button>
      </div>
    </article>
  );
};
