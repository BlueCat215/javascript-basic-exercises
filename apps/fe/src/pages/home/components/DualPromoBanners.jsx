import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  usePromoBannerProducts,
  useClearanceBannerProducts,
} from "../hooks/useHomeQueries";

const ROTATE_INTERVAL_MS = 3000;

function useRandomRotation(items, intervalMs = ROTATE_INTERVAL_MS) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items?.length]);

  useEffect(() => {
    if (!items || items.length <= 1) return undefined;

    const id = setInterval(() => {
      setIndex((prev) => {
        let next = Math.floor(Math.random() * items.length);
        while (next === prev) next = Math.floor(Math.random() * items.length);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(id);
  }, [items, intervalMs]);

  return items?.[index] ?? null;
}

export const DualPromoBanners = () => {
  const { data: promoData } = usePromoBannerProducts();
  const { data: saleItems } = useClearanceBannerProducts();

  const promoPool = promoData?.items ?? [];
  const salePool = saleItems ?? [];

  const featured = useRandomRotation(promoPool);
  const onSale = useRandomRotation(salePool);

  if (!featured && !onSale) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-ink rounded-2xl border border-line p-8 text-white flex items-center justify-between relative overflow-hidden min-h-70">
        {featured && (
          <div
            key={featured.id}
            className="banner-fade flex items-center justify-between w-full"
          >
            <div className="space-y-4 max-w-[60%] z-10">
              <span className="bg-white text-ink px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
                Giá tốt nhất
              </span>
              <div className="text-3xl mt-4 md:text-4xl font-display font-bold text-gold">
                ${featured.price}
              </div>
              <p className="text-base text-white/80 line-clamp-2 leading-relaxed">
                {featured.title}
              </p>
              <Link
                to={`/products/${featured.id}`}
                className="inline-block bg-green text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-green-light transition"
              >
                Mua ngay
              </Link>
            </div>
            <img
              src={featured.image}
              alt={featured.title}
              className="w-48 h-48 object-contain z-10 mix-blend-screen"
            />
          </div>
        )}
      </div>

      <div className="bg-neutral-50 rounded-2xl border border-green p-8 text-ink flex items-center justify-between min-h-70">
        {onSale ? (
          <div
            key={onSale.id}
            className="banner-fade flex items-center justify-between w-full"
          >
            <div className="space-y-4 max-w-[65%]">
              <span className="border border-rust text-rust px-3 py-1 rounded-sm text-[10px] uppercase font-bold tracking-widest">
                {onSale.originalPrice > onSale.price
                  ? `Giảm ${Math.round(
                      ((onSale.originalPrice - onSale.price) /
                        onSale.originalPrice) *
                        100,
                    )}%`
                  : "Ưu đãi"}
              </span>
              <div className="text-2xl md:text-3xl font-display font-bold text-ink leading-tight">
                ${onSale.price}
                {onSale.originalPrice > onSale.price && (
                  <span className="ml-2 text-base font-normal text-ink/40 line-through">
                    ${onSale.originalPrice}
                  </span>
                )}
              </div>
              <p className="text-sm text-ink/70 line-clamp-2">{onSale.title}</p>
              <Link
                to={`/products/${onSale.id}`}
                className="inline-block bg-ink text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-ink/80 transition"
              >
                Mua ngay
              </Link>
            </div>
            <img
              src={onSale.image}
              alt={onSale.title}
              className="w-48 h-48 object-contain"
            />
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
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
        )}
      </div>
    </section>
  );
};
