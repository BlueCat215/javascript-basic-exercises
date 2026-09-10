import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useHomeQueries";
import {
  getCategoryIcon,
  categoryBadgeColors,
} from "../../../components/icons";

export const PopularCategoriesGrid = () => {
  const { data: categories = [] } = useCategories();
  if (categories.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-14">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-display font-bold text-ink">
          Danh mục phổ biến
        </h2>
        <div className="w-12 h-0.5 bg-green mx-auto mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        {categories.map((c, i) => {
          const Icon = getCategoryIcon(c);
          return (
            <Link
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
              className="group flex flex-col items-center"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg group-hover:scale-105 transition-transform ${categoryBadgeColors[i % categoryBadgeColors.length]}`}
              >
                <Icon size={24} />
              </div>
              <span className="text-[11px] font-medium text-ink/70 mt-2 group-hover:text-green capitalize">
                {c}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
