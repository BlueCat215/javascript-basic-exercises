import { ProductCard } from "../../../components/ProductCard";
import { useRelatedProducts } from "../hooks/useRelatedProducts";

export const RelatedProductsSection = ({ category, excludeId }) => {
  const { data: related = [] } = useRelatedProducts(category, excludeId);
  if (related.length === 0) return null;

  return (
    <section className="bg-white rounded-lg border border-line p-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-ink mb-5">
        Sản phẩm liên quan
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};
