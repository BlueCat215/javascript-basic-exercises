import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories, useRecommendedProducts } from "../hooks/useHomeQueries";
import { ProductCard } from "../../../components/ProductCard";
import { LoadingState, EmptyState } from "../../../components/StatusState";

const buildViewAllLink = (tab) => {
  if (tab === "best-seller") return "/products?isBestSeller=true";
  if (tab === "top-rated") return "/products?sort=rating_desc";
  return `/products?category=${encodeURIComponent(tab)}`;
};

export const RecommendedSection = () => {
  const { data: categories = [] } = useCategories();
  const [tab, setTab] = useState("best-seller");

  const tabs = [
    { key: "best-seller", label: "Bán chạy" },
    { key: "top-rated", label: "Đánh giá cao" },
    ...categories.map((c) => ({ key: c, label: c })),
  ];

  const { data: products = [], isLoading } = useRecommendedProducts(tab);

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl md:text-2xl font-display font-bold text-ink uppercase tracking-wider">
          Gợi ý cho bạn
        </h2>
        <Link
          to={buildViewAllLink(tab)}
          className="text-xs font-bold uppercase tracking-wider text-ink/60 hover:text-ink transition-colors"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar items-center gap-6 mb-8 border-b border-line/60">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 font-bold uppercase tracking-wider text-[11px] whitespace-nowrap transition-colors border-b-2 ${
              tab === key
                ? "border-green text-green"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && products.length === 0 && (
        <EmptyState message="Chưa có sản phẩm cho mục này" />
      )}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
