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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
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

      <section className="bg-white rounded-2xl border border-line shadow-sm p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 transition-all">
        {/* Cột 1: Hình ảnh */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full aspect-square max-h-115  border-line flex items-center justify-center p-8 group overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain h-full w-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>

        {/* Cột 2: Thông tin sản phẩm */}
        <div className="lg:col-span-4 flex flex-col justify-between py-2">
          <div className="space-y-4">
            {product.rating && (
              <div className="flex items-center gap-2">
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
                <span className="text-sm text-ink/50 font-medium">
                  ({product.rating.count} đánh giá)
                </span>
              </div>
            )}

            <h1 className="text-2xl lg:text-3xl font-display font-bold text-ink leading-tight">
              {product.title}
            </h1>

            <div className="pt-2">
              <span className="text-3xl font-display font-extrabold text-green tracking-tight">
                ${product.price}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold tracking-wider uppercase">
              <span className="bg-green/10 text-green px-2.5 py-1 rounded-md">
                Miễn phí vận chuyển
              </span>
              <span className="bg-amber-50 text-gold px-2.5 py-1 rounded-md">
                Đổi trả 30 ngày
              </span>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-line text-sm text-ink/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink/80">ID Sản phẩm:</span>
              <span>#{product.id}</span>
            </div>
            <div className="flex items-center justify-between capitalize">
              <span className="font-semibold text-ink/80">Danh mục:</span>{" "}
              <span>{product.category}</span>
            </div>
            {product.brand && (
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink/80">Thương hiệu:</span>{" "}
                <span className="font-medium text-ink">{product.brand}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột 3: Khối mua hàng (Action Box) */}
        <div className="lg:col-span-3">
          <div className="bg-paper border border-line rounded-2xl p-6 space-y-5 lg:sticky lg:top-6 shadow-sm">
            <div>
              <span className="text-xs font-bold text-ink/40 uppercase tracking-widest block mb-1">
                Tổng tiền dự kiến
              </span>
              <div className="text-3xl font-display font-extrabold text-ink">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-green bg-green/5 p-3 rounded-lg border border-green/10">
              <ShieldIcon size={16} /> <span>Còn hàng, sẵn sàng giao</span>
            </div>

            <div className="flex items-center border-2 border-line rounded-lg bg-white overflow-hidden h-11 transition-colors focus-within:border-green/30">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-11 h-full flex items-center justify-center text-ink/60 hover:bg-paper hover:text-ink transition-colors"
              >
                <MinusIcon size={16} />
              </button>
              <span className="w-full text-center text-sm font-bold text-ink">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-11 h-full flex items-center justify-center text-ink/60 hover:bg-paper hover:text-ink transition-colors"
              >
                <PlusIcon size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className="btn-primary w-full h-11 text-base shadow-sm disabled:opacity-50"
            >
              {isPending ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
            </button>

            <button
              onClick={handleToggleFavorite}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium text-ink/60 hover:text-rust transition-colors pt-4 border-t border-line"
            >
              <HeartIcon
                size={18}
                className={`transition-colors ${isFavorite ? "fill-rust text-rust" : ""}`}
              />
              {isFavorite ? "Đã lưu yêu thích" : "Lưu vào yêu thích"}
            </button>

            <div className="pt-4 flex items-center justify-center gap-5 text-ink/30">
              <TruckIcon
                size={20}
                className="hover:text-ink/60 transition-colors"
              />
              <ShieldIcon
                size={20}
                className="hover:text-ink/60 transition-colors"
              />
              <ReturnIcon
                size={20}
                className="hover:text-ink/60 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="bg-white rounded-2xl border border-line shadow-sm p-6 lg:p-8">
        <div className="flex items-center gap-8 border-b border-line mb-6 text-sm font-bold uppercase tracking-wider overflow-x-auto hide-scrollbar">
          {[
            { key: "description", label: "Mô tả chi tiết" },
            {
              key: "reviews",
              label: `Đánh giá (${product.rating?.count || 0})`,
            },
            { key: "specs", label: "Thông số sản phẩm" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 relative transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-green"
                  : "text-ink/40 hover:text-ink/80"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>

        <div className="text-base text-ink/80 leading-relaxed min-h-[150px]">
          {activeTab === "description" && (
            <p className="max-w-4xl">{product.description}</p>
          )}

          {activeTab === "reviews" &&
            (product.rating ? (
              <div className="flex items-center gap-6 p-6 bg-paper rounded-xl border border-line/50 max-w-sm">
                <div className="text-5xl font-display font-extrabold text-ink">
                  {product.rating.rate}
                </div>
                <div>
                  <div className="flex text-gold mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={18}
                        className={
                          i < Math.round(product.rating.rate)
                            ? "fill-gold text-gold"
                            : "text-line"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-ink/50 font-medium">
                    Dựa trên {product.rating.count} đánh giá
                  </p>
                </div>
              </div>
            ) : (
              <p className="italic text-ink/50">
                Sản phẩm chưa có đánh giá nào.
              </p>
            ))}

          {activeTab === "specs" && (
            <div className="max-w-2xl border border-line rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-line">
                  <tr className="bg-paper/50">
                    <th className="py-3 px-4 font-semibold text-ink w-1/3">
                      Mã sản phẩm
                    </th>
                    <td className="py-3 px-4">#{product.id}</td>
                  </tr>
                  <tr>
                    <th className="py-3 px-4 font-semibold text-ink capitalize">
                      Danh mục
                    </th>
                    <td className="py-3 px-4 capitalize">{product.category}</td>
                  </tr>
                  {product.brand && (
                    <tr className="bg-paper/50">
                      <th className="py-3 px-4 font-semibold text-ink">
                        Thương hiệu
                      </th>
                      <td className="py-3 px-4 font-medium">{product.brand}</td>
                    </tr>
                  )}
                  <tr>
                    <th className="py-3 px-4 font-semibold text-ink">
                      Giá niêm yết
                    </th>
                    <td className="py-3 px-4">${product.price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
