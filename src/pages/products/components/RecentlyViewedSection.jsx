import { Link } from "react-router-dom";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed";

export const RecentlyViewedSection = ({ excludeId }) => {
  const items = useRecentlyViewed(excludeId);
  if (items.length === 0) return null;

  return (
    <section className="bg-white rounded-lg border border-line p-5">
      <h2 className="text-xs font-bold uppercase tracking-wider text-ink mb-4">
        Sản phẩm đã xem gần đây
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="flex items-center gap-3 p-2 border border-line rounded hover:border-green transition"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-12 h-12 object-contain rounded bg-paper"
            />
            <div className="text-[11px] leading-tight min-w-0">
              <span className="text-ink font-semibold block truncate">
                {p.title}
              </span>
              <span className="text-green font-bold">${p.price}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
