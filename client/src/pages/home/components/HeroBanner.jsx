import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useProductListQuery } from "../../../hooks/useProductListQuery";
import { ChevronLeftIcon, ChevronRightIcon } from "../../../components/icons";
import { ImageWithSkeleton } from "../../../components/ImageWithSkeleton";
import { imageUrl } from "../../../utils/imageUrl";

const REQUIRED_FIELDS = ["title", "price", "image", "description", "category"];
const SLIDE_COUNT = 4;

const isProductComplete = (product) =>
  REQUIRED_FIELDS.every((field) => {
    const value = product?.[field];
    return value !== null && value !== undefined && value !== "";
  });

export const HeroBanner = () => {
  const { data } = useProductListQuery({
    page: 1,
    pageSize: 20,
    sort: "newest",
  });

  // Lấy cố định 4 sản phẩm đầu tiên hợp lệ để tránh bị thay đổi ngẫu nhiên khi re-render
  const slides = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter(isProductComplete).slice(0, SLIDE_COUNT);
  }, [data]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset index về 0 nếu danh sách slide thay đổi số lượng
  useEffect(() => {
    setActiveIndex(0);
  }, [slides.length]);

  // Pre-load hình ảnh của tất cả các slide để chuyển mượt mà hơn
  useEffect(() => {
    if (!slides.length) return;

    slides.forEach((slide) => {
      if (!slide?.image) return;
      const img = new Image();
      img.src = slide.image;
    });
  }, [slides]);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const product = slides[activeIndex];

  const goPrev = () =>
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % slides.length);

  return (
    <section className="relative w-full bg-linear-to-r from-[#f2ebdf] via-[#f2ebdf] to-[#ece2d2] overflow-hidden">
      <div className="relative flex items-center justify-center min-h-105 max-w-[1920px] mx-auto">
        {slides.length > 1 && (
          <button
            onClick={goPrev}
            aria-label="Sản phẩm trước"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-24 w-8 bg-white flex items-center justify-center text-ink/50 hover:text-ink hover:bg-white/90 transition-colors z-20"
          >
            <ChevronLeftIcon size={16} />
          </button>
        )}

        <div className="flex items-center justify-center gap-16 md:gap-24 px-16 md:px-24 w-full">
          <div className="max-w-md space-y-4 text-left">
            <p className="text-sm font-semibold text-ink/70">
              {product.brand ?? "MiniShop"}
            </p>
            <h1 className="text-3xl md:text-4xl text-ink leading-tight">
              <span className="font-bold">
                {product.title.split(" ").slice(0, 2).join(" ")}
              </span>{" "}
              {product.title.split(" ").slice(2).join(" ")}
            </h1>
            <p className="text-sm text-ink/60 leading-relaxed line-clamp-2">
              {product.description}
            </p>
            <Link
              to={`/products/${product.id}`}
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded tracking-widest uppercase px-6 py-3 transition-colors"
            >
              Mua ngay
            </Link>
          </div>

          <div className="hidden md:block relative h-85 w-95 shrink-0">
            <ImageWithSkeleton
              key={product.id}
              src={imageUrl(product.image)}
              alt={product.title}
              loading="eager"
              className="absolute inset-0"
              imgClassName="object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {slides.length > 1 && (
          <button
            onClick={goNext}
            aria-label="Sản phẩm tiếp theo"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-24 w-8 bg-white flex items-center justify-center text-ink/50 hover:text-ink hover:bg-white/90 transition-colors z-20"
          >
            <ChevronRightIcon size={16} />
          </button>
        )}
      </div>
    </section>
  );
};
