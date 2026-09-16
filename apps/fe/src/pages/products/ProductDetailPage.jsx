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

import { Breadcrumb } from "../../components/Breadcrumb";
import { RelatedProductsSection } from "./components/detail/RelatedProductsSection";
import { RecentlyViewedSection } from "./components/detail/RecentlyViewedSection";
import { ProductGallery } from "./components/detail/ProductGallery";
import { ProductInfo } from "./components/detail/ProductInfo";
import { ProductPurchasePanel } from "./components/detail/ProductPurchasePanel";
import { ProductTabs } from "./components/detail/ProductTabs";

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
        <ProductGallery product={product} />
        <ProductInfo product={product} />
        <ProductPurchasePanel
          product={product}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          isFavorite={isFavorite}
          onToggleFavorite={handleToggleFavorite}
          isAddingToCart={isPending}
          onAddToCart={handleAddToCart}
        />
      </section>

      <ProductTabs
        product={product}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      <RelatedProductsSection
        category={product.category}
        excludeId={product.id}
      />
      <RecentlyViewedSection excludeId={product.id} />
    </div>
  );
}
