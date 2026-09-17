import { Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { useProductListQuery } from "../hooks/useProductListQuery";
import { imageUrl } from "../utils/imageUrl";

const REQUIRED_FIELDS = ["title", "price", "image", "description", "category"];

const isProductComplete = (product) =>
  REQUIRED_FIELDS.every((field) => {
    const value = product?.[field];
    return value !== null && value !== undefined && value !== "";
  });

const pickRandomItem = (items) => {
  if (!items || items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const TopPromoBanner = () => {
  const { data, isLoading } = useProductListQuery({
    page: 1,
    pageSize: 20,
    sort: "newest",
  });

  const [promoProduct, setPromoProduct] = useState(null);

  const completeItems = useMemo(() => {
    const items = data?.items ?? [];
    return items.filter(isProductComplete);
  }, [data?.items]);

  useEffect(() => {
    if (completeItems.length > 0 && !promoProduct) {
      setPromoProduct(pickRandomItem(completeItems));
    }
  }, [completeItems, promoProduct]);

  if (isLoading) return null;

  return (
    <div className="bg-[#F1DC67] py-2.5 sm:py-3 lg:py-0 lg:min-h-25 flex items-center w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 w-full flex flex-row lg:grid lg:grid-cols-3 items-center justify-between gap-3 lg:gap-6">
        <div className="text-left min-w-0 flex-1 lg:flex-initial">
          <h2 className="text-xs sm:text-base lg:text-3xl xl:text-4xl font-display font-black text-black leading-tight truncate sm:whitespace-normal">
            Mua sắm ngay{" "}
            <span className="lg:hidden text-[#E84C3D] inline-block font-black">
              - Mã: SALE10
            </span>
          </h2>
          <p className="hidden lg:block text-sm xl:text-[15px] text-black mt-1">
            Giảm giá cho đơn hàng đầu tiên
          </p>
        </div>

        <div className="hidden lg:flex items-center justify-center gap-3 xl:gap-4 w-full">
          <div className="flex items-center justify-between bg-white rounded-sm px-4 xl:px-6 py-2 xl:py-2.5 shadow-sm w-64 xl:w-72 shrink-0 animate-bounce motion-reduce:animate-none">
            <div className="flex items-center gap-1.5 xl:gap-2">
              <span className="text-3xl xl:text-4xl font-display font-black text-[#E84C3D] leading-none tracking-tighter">
                10%
              </span>
              <div className="text-[10px] xl:text-[12px] font-bold text-black leading-tight flex flex-col justify-center">
                <span>SALE</span>
                <span>OFF</span>
              </div>
            </div>

            <div className="w-px h-8 xl:h-10 bg-gray-300 mx-2 xl:mx-4"></div>

            <div className="text-left flex flex-col justify-center flex-1">
              <span className="text-[10px] xl:text-[11px] text-gray-500 mb-0.5 whitespace-nowrap">
                Nhập mã khuyến mãi
              </span>
              <span className="text-base xl:text-lg font-black text-black tracking-wide leading-none">
                SALE10
              </span>
            </div>
          </div>

          {promoProduct?.image && (
            <img
              src={imageUrl(promoProduct.image)}
              alt={promoProduct.title || "Sản phẩm khuyến mãi"}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="w-16 h-16 xl:w-20 xl:h-20 object-contain shrink-0"
            />
          )}
        </div>

        <div className="flex items-center justify-end shrink-0">
          <Link
            to={promoProduct ? `/products/${promoProduct.id}` : "/products"}
            className="bg-green hover:bg-green-light/90 text-white text-[11px] sm:text-xs lg:text-[13px] font-bold uppercase tracking-wider px-3 py-1.5 sm:px-4 sm:py-2 lg:px-8 lg:py-3.5 rounded-sm transition shrink-0 whitespace-nowrap shadow-sm active:scale-95"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
