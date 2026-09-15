import { Link } from "react-router-dom";
import { useRef } from "react";
import { useCategories } from "../hooks/useHomeQueries";
import {
  getCategoryIcon,
  categoryBadgeColors,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "../../../components/icons";

export const PopularCategoriesGrid = () => {
  const { data: categories = [] } = useCategories();
  const scrollRef = useRef(null);

  if (categories.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 mt-14 relative">
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl font-display font-bold text-ink">
          Danh mục phổ biến
        </h2>
        <div className="w-12 h-0.5 bg-green mx-auto mt-2" />
      </div>

      <div className="relative group flex items-center px-2 md:px-6">
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Cuộn trái"
        >
          <ChevronLeftIcon size={24} className="text-ink" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory w-full pb-4 px-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <Link
            to="/products?isNew=true"
            className="group flex flex-col items-center shrink-0 snap-start w-24 md:w-28"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg  transition-transform">
              <img src="/new.svg" alt="" />
            </div>
            <span className="text-[12px] font-bold text-ink mt-2 group-hover:text-green uppercase text-center wrap-break-words w-full px-1">
              Sản phẩm mới
            </span>
          </Link>
          <Link
            to="/products?onSale=true"
            className="group flex flex-col items-center shrink-0 snap-start w-24 md:w-28"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg  transition-transform">
              <img src="/sale.svg" alt="" />
            </div>
            <span className="text-[12px] font-bold text-ink mt-2 group-hover:text-green uppercase text-center wrap-break-words w-full px-1">
              Giảm giá
            </span>
          </Link>
          {categories.map((c, i) => {
            const Icon = getCategoryIcon(c);
            return (
              <Link
                key={c}
                to={`/products?category=${encodeURIComponent(c)}`}
                className="group flex flex-col items-center shrink-0 snap-start w-24 md:w-28"
              >
                <div
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-lg  transition-transform ${categoryBadgeColors[i % categoryBadgeColors.length]}`}
                >
                  <Icon size={24} />
                </div>
                <span className="text-[12px] font-bold text-ink mt-2 group-hover:text-green uppercase text-center wrap-break-words w-full px-1">
                  {c}
                </span>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-2 z-10 hidden md:flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md border border-gray-100 hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Cuộn phải"
        >
          <ChevronRightIcon size={24} className="text-ink" />
        </button>
      </div>
    </section>
  );
};
