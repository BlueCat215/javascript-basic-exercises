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
      <div className="flex items-center justify-between md:justify-center md:relative mb-6">
        <h2 className="text-[14px] md:text-3xl font-display font-bold text-ink/70 uppercase tracking-wider">
          <span className="text-green-light">Gợi ý</span>{" "}
          <span className="text-ink/40 font-normal">cho bạn từ minishop</span>
        </h2>
        <Link
          to={buildViewAllLink(tab)}
          className="text-xs font-bold text-ink hover:underline md:absolute md:right-0"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="flex overflow-x-auto scrollbar-none items-center md:justify-center gap-6 mt-6 mb-8 pt-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-block pb-2 font-bold tracking-wider text-[13px] whitespace-nowrap transition-all duration-300 border-b-2 hover:-translate-y-1 will-change-transform ${
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
