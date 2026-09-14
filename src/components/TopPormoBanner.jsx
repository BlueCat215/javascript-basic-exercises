import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useProductListQuery } from "../pages/products/hooks/useProductListQuery";

const REQUIRED_FIELDS = ["title", "price", "image", "description", "category"];

const isProductComplete = (product) =>
  REQUIRED_FIELDS.every((field) => {
    const value = product?.[field];
    return value !== null && value !== undefined && value !== "";
  });

const pickRandomItem = (items) => {
  if (items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
};

export const TopPromoBanner = () => {
  const { data } = useProductListQuery({
    page: 1,
    pageSize: 20,
    sort: "newest",
  });

  const product = useMemo(() => {
    const items = data?.items ?? [];
    const completeItems = items.filter(isProductComplete);
    return pickRandomItem(completeItems);
  }, [data]);

  return (
    <div className="bg-[#F1DC67] h-auto md:h-32 flex items-center w-full">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-black leading-tight">
            Mua sắm ngay hôm nay
          </h2>
          <p className="text-[15px] text-black mt-1">
            Giảm giá cho đơn hàng đầu tiên
          </p>
        </div>

        <div className="flex items-center bg-white rounded-sm px-5 py-2.5 shadow-sm shrink-0 animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-display font-black text-[#E84C3D] leading-none tracking-tighter">
              10%
            </span>
            <div className="text-[12px] font-bold text-black leading-tight flex flex-col justify-center">
              <span>SALE</span> <span>OFF</span>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-300 mx-5"></div>
          <div className="text-left flex flex-col justify-center">
            <span className="text-[11px] text-gray-500 mb-0.5">
              Nhập mã khuyến mãi
            </span>
            <span className="text-lg font-black text-black tracking-wide leading-none">
              SALE10
            </span>
          </div>
        </div>

        {product?.image && (
          <img
            src={product.image}
            alt={product.title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="hidden md:block w-24 h-24 lg:w-28 lg:h-28 object-contain shrink-0"
          />
        )}

        <Link
          to={product ? `/products/${product.id}` : "/products"}
          className="bg-green hover:bg-green-light/90 text-white text-[13px] font-bold uppercase tracking-wider px-8 py-3.5 rounded-sm transition shrink-0"
        >
          Mua ngay
        </Link>
      </div>{" "}
    </div>
  );
};
