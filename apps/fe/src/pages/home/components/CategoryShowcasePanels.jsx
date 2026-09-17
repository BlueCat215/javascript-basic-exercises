import { Link } from "react-router-dom";
import { useProductsByCategories } from "../hooks/useHomeQueries";
import { imageUrl } from "../../../utils/imageUrl";

const PANEL_THEMES = [
  { bg: "bg-green-light/50", accent: "text-white" },
  { bg: "bg-gold/10", accent: "text-green" },
  { bg: "bg-rust/5", accent: "text-rust" },
];

const PromoTile = ({ product }) => {
  if (!product) return null;
  const hasDiscount = product.originalPrice > product.price;

  return (
    <Link
      to={`/products/${product.id}`}
      className="relative h-30 rounded overflow-hidden flex items-end group"
    >
      <img
        src={imageUrl(product.image)}
        alt={product.title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/50 to-transparent" />
      <div className="relative p-3 text-white">
        <p className="text-xs font-semibold line-clamp-1">{product.title}</p>
        {hasDiscount ? (
          <p className="text-[11px] text-white/80">
            Chỉ từ <span className="font-bold text-gold">${product.price}</span>
          </p>
        ) : (
          <p className="text-[11px] text-white/80 underline underline-offset-2">
            Xem ngay
          </p>
        )}
      </div>
    </Link>
  );
};

const CategoryPanel = ({ category, products, theme }) => {
  const iconItems = products;
  const promoItems = products.slice(0, 2);

  if (!products.length) return null;

  return (
    <div className={`rounded-xl p-3 ${theme.bg}`}>
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-2xl font-display uppercase font-bold ${theme.accent}`}
        >
          {category}
        </h3>
        <Link
          to={`/products?category=${encodeURIComponent(category)}`}
          className={`text-xs font-semibold ${theme.accent} hover:text-ink`}
        >
          Xem tất cả
        </Link>
      </div>

      {iconItems.length > 0 && (
        <div className="grid grid-cols-4 gap-3 mb-5">
          {iconItems.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="flex flex-col items-center gap-2 text-center group"
            >
              <span className="w-16 h-16  flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={imageUrl(p.image)}
                  alt={p.title}
                  className="w-full h-full object-contain group-hover:scale-110 transition"
                />
              </span>
              <span
                className={`text-[11px] font-semibold ${theme.accent} line-clamp-2 leading-snug`}
              >
                {p.title}
              </span>
            </Link>
          ))}
        </div>
      )}

      {promoItems.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {promoItems.map((p) => (
            <PromoTile key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
export const CategoryShowcasePanels = ({ categories = [] }) => {
  const results = useProductsByCategories(categories);

  const hasAnyData = results.some((r) => r.data?.length);
  if (!categories.length || !hasAnyData) return null;

  return (
    <section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {categories.map((category, i) => (
        <CategoryPanel
          key={category}
          category={category}
          products={results[i]?.data ?? []}
          theme={PANEL_THEMES[i % PANEL_THEMES.length]}
        />
      ))}
    </section>
  );
};
