import { useState } from "react";
import { Link } from "react-router-dom";
import { useCategories, useNewArrivalProducts } from "../hooks/useHomeQueries";
import { ProductCard } from "../../../components/ProductCard";
import { LoadingState, EmptyState } from "../../../components/StatusState";

export const NewArrivalSection = () => {
  const { data: categories = [] } = useCategories();
  const [tab, setTab] = useState("featured");

  const tabs = [
    { key: "featured", label: "Nổi bật" },
    ...categories.map((c) => ({ key: c, label: c })),
  ];

  const { data: products = [], isLoading } = useNewArrivalProducts(tab);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] md:text-3xl font-display font-bold text-ink">
          <span className="text-ink/40 font-normal tracking-wider">
            Mặt hàng
          </span>
          <span className="text-green"> Mới</span>
        </h2>
        <Link
          to="/products?isNew=true&sort=newest"
          className="text-xs font-bold text-ink hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      <div className="flex overflow-x-auto scrollbar-none items-center gap-4 mb-6 pt-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-block px-4 py-2 rounded text-xs font-semibold capitalize transition-all duration-300 hover:-translate-y-1 will-change-transform ${
              tab === key
                ? "bg-green text-white shadow-sm"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
