import { StarIcon } from "../../../../components/icons";

export const ProductInfo = ({ product }) => {
  return (
    <div className="lg:col-span-5 flex flex-col space-y-6">
      <div className="space-y-3">
        {product.rating && (
          <div className="text-sm text-ink flex items-center gap-2">
            <StarIcon size={15} className="text-gold fill-gold" />
            <span>
              {product.rating.rate} ({product.rating.count} Đánh giá)
            </span>
            {product.purchases > 0 && (
              <span>- Đã bán: {product.purchases}</span>
            )}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
          {product.title}
        </h1>

        <div className="text-3xl font-bold text-ink pt-2 flex items-end gap-3">
          ${product.price}
          {product.originalPrice && (
            <span className="text-xl text-ink line-through pb-1">
              ${product.originalPrice}
            </span>
          )}
        </div>

        <p className="text-[15px] text-ink pt-2 line-clamp-3">
          {product.description}
        </p>

        <div className="flex gap-3 pt-3">
          <span className="bg-green text-white px-3 py-1 text-xs font-bold rounded">
            MIỄN PHÍ GIAO HÀNG
          </span>
          {product.isBestSeller && (
            <span className="bg-rust text-white px-3 py-1 text-xs font-bold rounded">
              BEST SELLER
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded flex items-center justify-center gap-5 mt-4">
        <img
          src="/banner_ads.svg"
          alt="Banner Ads"
          className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
        />
      </div>
    </div>
  );
};
