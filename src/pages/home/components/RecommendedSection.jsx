import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories, useRecommendedProducts } from "../hooks/useHomeQueries";
import { ProductCard } from "../../../components/ProductCard";
import { LoadingState, EmptyState } from "../../../components/StatusState";

// Ứng với mỗi tab, trỏ "Xem tất cả" sang ProductListPage với đúng bộ lọc tương ứng
// (isBestSeller / sort=rating_desc / category) thay vì trang /products/recommended không tồn tại
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-display font-bold text-ink">
          <span className="text-green-light">Đề xuất</span> bởi MiniShop
        </h2>
        <Link
          to={buildViewAllLink(tab)}
          className="text-xs text-ink hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded text-xs font-semibold capitalize transition ${
              tab === key
                ? "bg-green text-white"
                : "bg-paper text-ink/70 hover:bg-line"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
