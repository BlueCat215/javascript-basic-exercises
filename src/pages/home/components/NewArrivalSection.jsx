import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories, useNewArrivalProducts } from "../hooks/useHomeQueries";
import { ProductCard } from "../../../components/ProductCard";
import { LoadingState, EmptyState } from "../../../components/StatusState";

export const NewArrivalSection = () => {
  const { data: categories = [] } = useCategories();
  const [tab, setTab] = useState("featured");

  const tabs = [
    { key: "featured", label: "Featured" },
    ...categories.map((c) => ({ key: c, label: c })),
  ];

  const { data: products = [], isLoading } = useNewArrivalProducts(tab);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-ink">
          <span className="text-green">New</span> Arrival
        </h2>
        <Link
          to="/products?sort=newest"
          className="text-xs text-ink hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
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
        <EmptyState message="Chưa có sản phẩm mới cho mục này" />
      )}
      {!isLoading && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
