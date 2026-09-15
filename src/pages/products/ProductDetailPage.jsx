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
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
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
    <div className="max-w-350 mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-10 sm:space-y-12">
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

      {/* Main Product Layout - 3 Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Cột 1 (4 spans): Hình ảnh */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative w-full aspect-3/4 flex items-center justify-center p-6 group ">
            {product.isNew && (
              <span className="absolute top-4 left-4 bg-ink text-white text-xs font-bold px-3 py-1 rounded">
                NEW
              </span>
            )}
            <img
              src={product.image}
              alt={product.title}
              className="object-contain h-full w-full mix-blend-multiply"
            />
          </div>
          <div className="flex gap-4">
            <div className="w-20 h-24 bg-neutral-50 rounded-lg border border-ink shrink-0 flex items-center justify-center p-2 cursor-pointer transition-colors">
              <img
                src={product.image}
                alt="thumb"
                className="object-contain h-full w-full mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="space-y-3">
            {product.rating && (
              <div className="text-sm text-ink flex items-center gap-2">
                <StarIcon size={15} className="text-gold fill-gold" />
                <span>
                  {product.rating.rate} ({product.rating.count} Đánh giá)
                </span>
                {product.purchases > 0 && (
                  <span>- Đã bán: {product.purchases}</span>
                )}
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
              {product.title}
            </h1>

            <div className="text-3xl font-bold text-ink pt-2 flex items-end gap-3">
              ${product.price}
              {product.originalPrice && (
                <span className="text-xl text-ink line-through pb-1">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <p className="text-[15px] text-ink pt-2 line-clamp-3">
              {product.description}
            </p>

            <div className="flex gap-3 pt-3">
              <span className="bg-green text-white px-3 py-1 text-xs font-bold rounded">
                MIỄN PHÍ GIAO HÀNG
              </span>
              {product.isBestSeller && (
                <span className="bg-rust text-white px-3 py-1 text-xs font-bold rounded">
                  BEST SELLER
                </span>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded flex items-center justify-center gap-5 mt-4">
            <img
              src="/banner_ads.svg"
              alt="Banner Ads"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-[#f4f5f9] rounded p-6 lg:sticky lg:top-6 flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold text-ink/50 uppercase">
                Tổng Giá:
              </p>
              <div className="text-4xl font-display font-bold text-ink mt-1">
                ${(product.price * quantity).toFixed(2)}
              </div>
            </div>

            <div
              className={`flex items-center gap-2 text-sm font-bold ${product.inStock ? "text-green" : "text-rust"}`}
            >
              <ShieldIcon size={16} />{" "}
              <span>{product.inStock ? "Có sẵn hàng" : "Hết hàng"}</span>
            </div>

            {/* Quantity - Logic chuẩn */}
            <div className="flex items-center bg-white border border-line rounded-lg overflow-hidden h-12">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-12 h-full flex items-center justify-center hover:bg-neutral-50"
              >
                <MinusIcon size={16} />
              </button>
              <span className="flex-1 text-center font-bold">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-12 h-full flex items-center justify-center hover:bg-neutral-50"
              >
                <PlusIcon size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={isPending || !product.inStock}
                className="w-full bg-green hover:bg-green-light/90 text-white h-12 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                {isPending ? "ĐANG XỬ LÝ..." : "THÊM VÀO GIỎ HÀNG"}
              </button>
              <button className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-ink h-12 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                BUY WITH
                <strong className="italic">
                  <span className="text-blue-400">Pay</span>
                  <span className="text-blue-700">Pal</span>
                </strong>
              </button>
            </div>

            <div className="flex items-center justify-between text-sm font-semibold text-ink/60 pt-2 border-b border-line/50 pb-5">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-2 hover:text-ink transition-colors ${isFavorite ? "text-green" : ""}`}
              >
                <HeartIcon
                  size={16}
                  className={isFavorite ? "fill-red-500" : ""}
                />
                {isFavorite
                  ? "Đã thêm vào mục yêu thích"
                  : "Thêm vào mục yêu thích"}
              </button>
            </div>

            {/* Safe Checkout Badges */}
            <div>
              <div className="flex gap-2 justify-center">
                {[TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon].map(
                  (Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-8 h-8 rounded-full bg-[#f4f6f8] hover:bg-green hover:text-white flex items-center justify-center transition text-gray-700 shrink-0"
                    >
                      <Icon size={20} />
                    </a>
                  ),
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 mt-2 shadow-sm text-center">
              <div className="inline-block bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
                Đặt hàng nhanh 24/7
              </div>
              <div className="text-xl font-bold text-ink">19001234</div>
            </div>

            <p className="text-sm text-center pt-2">
              <TruckIcon size={20} className="inline mr-2" /> Giao hàng{" "}
              <strong>tận nơi</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="pt-10">
        <div className="flex items-center gap-8 border-b border-line/60 mb-8 text-sm font-bold uppercase tracking-wider overflow-x-auto hide-scrollbar">
          {[
            { key: "description", label: "Mô tả chi tiết" },
            {
              key: "reviews",
              label: `Đánh giá (${product.rating?.count || 0})`,
            },
            { key: "specs", label: "Thông số kỹ thuật" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-4 relative transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.key
                  ? "text-green"
                  : "text-ink/40 hover:text-ink/80"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green rounded-full"></span>
              )}
            </button>
          ))}
        </div>

        <div className="text-base sm:text-lg text-ink/80 leading-relaxed min-h-75">
          {activeTab === "description" && (
            <p className="max-w-4xl leading-8 text-ink">
              {product.description}
            </p>
          )}

          {activeTab === "reviews" &&
            (product.rating ? (
              <div className="flex items-center gap-6 p-6 bg-neutral-50/80 rounded-xl border border-line/50 max-w-md">
                <div className="text-5xl font-display font-bold text-ink">
                  {product.rating.rate}
                </div>
                <div>
                  <div className="flex text-gold mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon
                        key={i}
                        size={20}
                        className={
                          i < Math.round(product.rating.rate)
                            ? "fill-gold text-gold"
                            : "text-line/60"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-sm text-ink/50 font-medium">
                    Dựa trên {product.rating.count} đánh giá từ khách hàng
                  </p>
                </div>
              </div>
            ) : (
              <p className="italic text-ink/50 text-base">
                Sản phẩm chưa có đánh giá nào.
              </p>
            ))}

          {activeTab === "specs" && (
            <div className="w-full max-w-4xl mx-auto border border-line rounded overflow-hidden mt-6 mb-12 ">
              <table className="w-full text-base sm:text-lg text-left">
                <tbody className="divide-y divide-line/60">
                  <tr className="bg-neutral-50/50 transition-colors hover:bg-neutral-100/50">
                    <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink w-1/3">
                      Mã sản phẩm
                    </th>
                    <td className="py-5 px-6 sm:py-6 sm:px-8 font-mono">
                      #{product.id}
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-neutral-50/30">
                    <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink capitalize">
                      Danh mục
                    </th>
                    <td className="py-5 px-6 sm:py-6 sm:px-8 capitalize">
                      {product.category}
                    </td>
                  </tr>
                  {product.brand && (
                    <tr className="bg-neutral-50/50 transition-colors hover:bg-neutral-100/50">
                      <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink">
                        Thương hiệu
                      </th>
                      <td className="py-5 px-6 sm:py-6 sm:px-8 font-medium">
                        {product.brand}
                      </td>
                    </tr>
                  )}
                  <tr className="transition-colors hover:bg-neutral-50/30">
                    <th className="py-5 px-6 sm:py-6 sm:px-8 font-semibold text-ink">
                      Giá niêm yết
                    </th>
                    <td className="py-5 px-6 sm:py-6 sm:px-8 font-bold text-green">
                      ${product.price}
                    </td>
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
