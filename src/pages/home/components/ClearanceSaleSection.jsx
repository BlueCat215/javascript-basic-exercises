import { Link } from "react-router-dom";
import { useClearanceProducts } from "../hooks/useHomeQueries";
import { ProductCard } from "../../../components/ProductCard";
import { LoadingState } from "../../../components/StatusState";

export const ClearanceSaleSection = () => {
  const { data: products = [], isLoading } = useClearanceProducts();

  if (!isLoading && products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-ink">
          <span className="text-green">Clearance</span> Sale{" "}
          <span className="text-ink/40 font-normal">| Up to 70% OFF</span>
        </h2>
        <Link
          to="/products?sort=price_asc"
          className="text-xs text-ink hover:underline"
        >
          Xem tất cả
        </Link>
      </div>

      {isLoading && <LoadingState />}
      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};
