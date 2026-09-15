import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export const RecentlyViewedSection = ({ excludeId }) => {
  const items = useRecentlyViewed(excludeId);
  if (items.length === 0) return null;

  return (
    <section className="pt-10 border-t border-line/60">
      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-ink/80 mb-6">
        Sản phẩm đã xem gần đây
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-line/50 bg-neutral-50/40 hover:bg-neutral-100/60 hover:border-line hover:shadow-sm transition-all group"
          >
            <div className="shrink-0 w-24 h-24 flex items-center justify-center p-2 overflow-hidden">
              <img
                src={p.image}
                alt={p.title}
                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="text-sm leading-snug min-w-0 flex-1 flex flex-col justify-center">
              <span className="text-ink/90 font-semibold block truncate mb-1.5 group-hover:text-green transition-colors">
                {p.title}
              </span>
              <span className="text-green font-bold text-base sm:text-lg">
                ${p.price}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
