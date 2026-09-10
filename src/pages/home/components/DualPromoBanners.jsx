import { Link } from "react-router-dom";
import { usePromoProducts } from "../hooks/useHomeQueries";

export const DualPromoBanners = () => {
  const { data } = usePromoProducts();
  const cheapest = data?.items?.[0];
  if (!cheapest) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gradient-to-r from-green to-green-light rounded-xl p-6 md:p-8 text-white flex items-center justify-between">
        <div className="space-y-3 max-w-[60%]">
          <span className="bg-gold text-green px-2.5 py-1 rounded text-[10px] uppercase font-bold">
            Giá tốt nhất
          </span>
          <div className="text-3xl md:text-4xl font-display font-bold text-gold-light">
            ${cheapest.price}
          </div>
          <p className="text-xs text-white/80 line-clamp-2">{cheapest.title}</p>
          <Link
            to={`/products/${cheapest.id}`}
            className="inline-block bg-white text-ink font-semibold text-xs px-5 py-2.5 rounded hover:bg-paper transition"
          >
            Xem ngay
          </Link>
        </div>
        <img
          src={cheapest.image}
          alt={cheapest.title}
          className="w-32 h-32 object-contain bg-white/10 rounded-lg p-2"
        />
      </div>

      <div className="bg-gradient-to-r from-paper to-gold-light/40 rounded-xl p-6 md:p-8 text-ink flex items-center justify-between border border-line">
        <div className="space-y-3 max-w-[60%]">
          <span className="bg-green text-white px-2.5 py-1 rounded text-[10px] uppercase font-bold">
            Ưu đãi
          </span>
          <div className="text-2xl md:text-3xl font-display font-bold text-green leading-tight">
            Miễn phí vận chuyển đơn từ $199
          </div>
          <p className="text-xs text-ink/60">
            Đặt hàng ngay hôm nay để nhận ưu đãi.
          </p>
          <Link
            to="/products"
            className="inline-block bg-green text-white font-semibold text-xs px-5 py-2.5 rounded hover:bg-green-light transition"
          >
            Khám phá
          </Link>
        </div>
        <div className="w-32 h-32 rounded-lg bg-white/60 border-2 border-white" />
      </div>
    </section>
  );
};
