import { Link } from "react-router-dom";
import { ProductCard } from "../../../components/ProductCard";

export const CategorySection = ({ title, products }) => {
  if (products.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold text-ink capitalize">
          {title}
        </h2>
        <Link
          to={`/products?category=${encodeURIComponent(title)}`}
          className="text-sm text-gold hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
