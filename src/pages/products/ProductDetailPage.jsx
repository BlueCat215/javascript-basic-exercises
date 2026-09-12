import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductDetailQuery } from "./hooks/useProductDetailQuery";
import { useAddToCart } from "../cart/hooks/useCartQueries";
import { useAuthStore } from "../../store/useAuthStore";
import { LoadingState, ErrorState } from "../../components/StatusState";
import {
  useIsFavorite,
  useAddFavorite,
  useRemoveFavorite,
} from "../account/hooks/useFavoriteQueries";
import { useTrackRecentlyViewed } from "./hooks/useRecentlyViewed";
import {
  PlusIcon,
  MinusIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  ShieldIcon,
  ReturnIcon,
} from "../../components/icons";
import { Breadcrumb } from "../../components/Breadcrumb";
import { RelatedProductsSection } from "./components/RelatedProductsSection";
import { RecentlyViewedSection } from "./components/RecentlyViewedSection";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: product, isLoading, isError } = useProductDetailQuery(id);
  const { mutate: addToCart, isPending } = useAddToCart();
  const isFavorite = useIsFavorite(product?.id);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  useTrackRecentlyViewed(product);

  const handleToggleFavorite = () => {
    if (!isAuthenticated)
      return navigate("/login", { state: { from: location } });
    if (isFavorite) removeFavorite(product.id);
    else addFavorite({ productId: product.id, product });
  };

  const handleQuantityChange = (delta) =>
    setQuantity((prev) => Math.max(1, prev + delta));

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
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <Breadcrumb
        items={[
          { to: "/products", label: "Sản phẩm" },
          {
            to: `/products?category=${encodeURIComponent(product.category)}`,
            label: product.category,
          },
          { label: product.title },
        ]}
      />

      <section className="bg-white rounded-lg border border-line p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột 1 */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-square max-h-[420px] bg-paper rounded-lg border border-line flex items-center justify-center p-6">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain h-full w-full"
            />
          </div>
        </div>

        {/* Cột 2 */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      key={i}
                      size={13}
                      className={
                        i < Math.round(product.rating.rate)
                          ? "fill-gold text-gold"
                          : "text-line"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-ink/50 font-medium">
                  ({product.rating.count} đánh giá)
                </span>
              </div>
            )}

            <h1 className="text-xl font-display font-bold text-ink mt-2 leading-snug">
              {product.title}
            </h1>

            <div className="mt-3">
              <span className="text-2xl font-display font-bold text-green">
                ${product.price}
              </span>
            </div>

            <div className="flex gap-2 mt-3 text-[10px] font-semibold tracking-wider uppercase">
              <span className="bg-green/10 text-green px-2 py-0.5 rounded">
                Miễn phí vận chuyển
              </span>
              <span className="bg-amber-50 text-gold px-2 py-0.5 rounded">
                Đổi trả 30 ngày
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-line text-[11px] text-ink/50 space-y-1">
            <div>
              <span className="font-semibold text-ink/70">ID:</span> #
              {product.id}
            </div>
            <div className="capitalize">
              <span className="font-semibold text-ink/70">Danh mục:</span>{" "}
              {product.category}
            </div>
            {product.brand && (
              <div>
                <span className="font-semibold text-ink/70">Thương hiệu:</span>{" "}
                {product.brand}
              </div>
            )}
          </div>
        </div>

        {/* Cột 3 */}
        <div className="lg:col-span-3">
          <div className="bg-paper border border-line rounded-lg p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold text-ink/40 uppercase tracking-wider block">
                Tổng tiền dự kiến
              </span>
              <div className="text-2xl font-display font-bold text-ink mt-1">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-green">
              <ShieldIcon size={14} /> <span>Còn hàng, sẵn sàng giao</span>
            </div>

            <div className="flex items-center border border-line rounded bg-white overflow-hidden h-9">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-9 h-full flex items-center justify-center text-ink/50 hover:bg-paper"
              >
                <MinusIcon size={14} />
              </button>
              <span className="w-full text-center text-xs font-bold text-ink">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-9 h-full flex items-center justify-center text-ink/50 hover:bg-paper"
              >
                <PlusIcon size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className="btn-primary w-full disabled:opacity-50"
            >
              {isPending ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>

            <button
              onClick={handleToggleFavorite}
              className="w-full flex items-center justify-center gap-2 text-xs text-ink/60 hover:text-rust pt-2 border-t border-line"
            >
              <HeartIcon
                size={16}
                className={isFavorite ? "fill-rust text-rust" : ""}
              />
              {isFavorite ? "Đã thích" : "Lưu vào yêu thích"}
            </button>

            <div className="pt-3 border-t border-line flex items-center justify-center gap-4 text-ink/40">
              <TruckIcon size={16} />
              <ShieldIcon size={16} />
              <ReturnIcon size={16} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg border border-line p-6">
        <div className="flex items-center gap-8 border-b border-line pb-3 text-xs font-bold uppercase tracking-wider">
          {[
            { key: "description", label: "Mô tả" },
            {
              key: "reviews",
              label: `Đánh giá (${product.rating?.count || 0})`,
            },
            { key: "specs", label: "Thông số" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 -mb-3 transition-colors ${activeTab === tab.key ? "text-green border-b-2 border-green" : "text-ink/40 hover:text-ink"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-6 text-xs text-ink/70 leading-relaxed">
          {activeTab === "description" && <p>{product.description}</p>}

          {activeTab === "reviews" &&
            (product.rating ? (
              <div className="flex items-center gap-4">
                <div className="text-3xl font-display font-bold text-ink">
                  {product.rating.rate}
                </div>
                <div>
                  <div className="flex text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={14}
                        className={
                          i < Math.round(product.rating.rate)
                            ? "fill-gold text-gold"
                            : "text-line"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-ink/50 mt-1">
                    Dựa trên {product.rating.count} đánh giá
                  </p>
                </div>
              </div>
            ) : (
              <p>Sản phẩm chưa có đánh giá nào.</p>
            ))}

          {activeTab === "specs" && (
            <table className="w-full text-xs">
              <tbody className="divide-y divide-line">
                <tr>
                  <td className="py-2 font-semibold text-ink w-40">
                    Mã sản phẩm
                  </td>
                  <td className="py-2">#{product.id}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-ink capitalize">
                    Danh mục
                  </td>
                  <td className="py-2 capitalize">{product.category}</td>
                </tr>
                {product.brand && (
                  <tr>
                    <td className="py-2 font-semibold text-ink">Thương hiệu</td>
                    <td className="py-2">{product.brand}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 font-semibold text-ink">Giá</td>
                  <td className="py-2">${product.price}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </section>

      <RelatedProductsSection
        category={product.category}
        excludeId={product.id}
      />
      <RecentlyViewedSection excludeId={product.id} />
    </div>
  );
}
