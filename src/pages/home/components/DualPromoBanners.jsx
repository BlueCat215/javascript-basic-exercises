import { Link } from "react-router-dom";
import { usePromoProducts } from "../hooks/useHomeQueries";

export const DualPromoBanners = () => {
  const { data } = usePromoProducts();
  const cheapest = data?.items?.[0];
  if (!cheapest) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-ink rounded border border-line p-8 text-white flex items-center justify-between relative overflow-hidden">
        <div className="space-y-4 max-w-[60%] z-10">
          <span className="bg-white text-ink px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
            Giá tốt nhất
          </span>
          <div className="text-3xl mt-4 md:text-4xl font-display font-bold text-gold ">
            ${cheapest.price}
          </div>
          <p className="text-base text-white/80 line-clamp-2 leading-relaxed">
            {cheapest.title}
          </p>
          <Link
            to={`/products/${cheapest.id}`}
            className="inline-block bg-green text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-green-light transition"
          >
            Mua ngay
          </Link>
        </div>
        <img
          src={cheapest.image}
          alt={cheapest.title}
          className="w-48 h-48 object-contain z-10 mix-blend-screen"
        />
      </div>

      <div className="bg-neutral-50 rounded border border-line p-8 text-ink flex items-center justify-between">
        <div className="space-y-4 max-w-[65%]">
          <span className="border border-green text-green px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
            Ưu đãi
          </span>
          <div className="text-2xl md:text-3xl font-display font-bold text-ink leading-tight">
            Miễn phí vận chuyển từ $199
          </div>
          <p className="text-sm text-ink/70">
            Áp dụng tự động tại bước thanh toán.
          </p>
          <Link
            to="/products?minPrice=199"
            className="inline-block bg-ink text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-ink/80 transition"
          >
            Khám phá
          </Link>
        </div>
        <div className="w-28 h-28 bg-white border border-line rounded rotate-12 shadow-sm" />
      </div>
    </section>
  );
};
