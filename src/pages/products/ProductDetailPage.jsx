import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductDetailQuery } from "./hooks/useProductDetailQuery";
import { useAddToCart } from "../cart/hooks/useCartQueries";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingState, ErrorState } from "../../components/StatusState";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: product, isLoading, isError } = useProductDetailQuery(id);
  const { mutate: addToCart, isPending } = useAddToCart();

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/login", { state: { from: location } });
      return;
    }
    addToCart(
      { productId: product.id, quantity },
      {
        onSuccess: () =>
          toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`),
        onError: () => toast.error("Thêm giỏ hàng thất bại"),
      },
    );
  };

  if (isLoading) return <LoadingState />;
  if (isError || !product)
    return <ErrorState message="Không tìm thấy sản phẩm" />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Ảnh sản phẩm */}
      <div className="bg-paper rounded-tag border border-line p-8 flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-96 object-contain"
        />
      </div>

      {/* Thông tin */}
      <div className="space-y-5">
        <p className="font-mono text-xs uppercase tracking-widest text-ink/40 capitalize">
          {product.category}
        </p>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-ink">
          {product.title}
        </h1>

        {product.rating && (
          <p className="text-sm text-ink/60">
            ⭐ {product.rating.rate} ({product.rating.count} đánh giá)
          </p>
        )}

        <p className="text-3xl font-mono font-bold text-gold">
          ${product.price}
        </p>

        <p className="text-ink/70 leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-4 pt-4 border-t border-line">
          <span className="text-sm font-semibold text-ink">Số lượng</span>
          <div className="flex items-center border border-line rounded-tag">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-9 h-9 grid place-items-center hover:bg-paper"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span className="w-10 text-center font-mono">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-9 h-9 grid place-items-center hover:bg-paper"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isPending}
          className="btn-primary w-full md:w-auto px-8 disabled:opacity-50"
        >
          {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
}
