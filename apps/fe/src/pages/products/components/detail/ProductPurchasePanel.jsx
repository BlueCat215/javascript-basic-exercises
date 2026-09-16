import {
  PlusIcon,
  MinusIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
} from "../../../../components/icons";

export const ProductPurchasePanel = ({
  product,
  quantity,
  onQuantityChange,
  isFavorite,
  onToggleFavorite,
  isAddingToCart,
  onAddToCart,
}) => {
  return (
    <div className="lg:col-span-3">
      <div className="bg-[#f4f5f9] rounded p-6 lg:sticky lg:top-6 flex flex-col gap-5">
        <div>
          <p className="text-xs font-bold text-ink/50 uppercase">Tổng Giá:</p>
          <div className="text-4xl font-display font-bold text-ink mt-1">
            ${(product.price * quantity).toFixed(2)}
          </div>
        </div>

        <div
          className={`flex items-center gap-2 text-sm font-bold ${product.inStock ? "text-green" : "text-rust"}`}
        >
          <ShieldIcon size={16} />{" "}
          <span>{product.inStock ? "Có sẵn hàng" : "Hết hàng"}</span>
        </div>

        {/* Quantity - Logic chuẩn */}
        <div className="flex items-center bg-white border border-line rounded-lg overflow-hidden h-12">
          <button
            onClick={() => onQuantityChange(-1)}
            className="w-12 h-full flex items-center justify-center hover:bg-neutral-50"
          >
            <MinusIcon size={16} />
          </button>
          <span className="flex-1 text-center font-bold">{quantity}</span>
          <button
            onClick={() => onQuantityChange(1)}
            className="w-12 h-full flex items-center justify-center hover:bg-neutral-50"
          >
            <PlusIcon size={16} />
          </button>
        </div>

        <div className="space-y-3">
          <button
            onClick={onAddToCart}
            disabled={isAddingToCart || !product.inStock}
            className="w-full bg-green hover:bg-green-light/90 text-white h-12 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {isAddingToCart ? "ĐANG XỬ LÝ..." : "THÊM VÀO GIỎ HÀNG"}
          </button>
          <button className="w-full bg-[#ffc439] hover:bg-[#f4bb33] text-ink h-12 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
            BUY WITH
            <strong className="italic">
              <span className="text-blue-400">Pay</span>
              <span className="text-blue-700">Pal</span>
            </strong>
          </button>
        </div>

        <div className="flex items-center justify-between text-sm font-semibold text-ink/60 pt-2 border-b border-line/50 pb-5">
          <button
            onClick={onToggleFavorite}
            className={`flex items-center gap-2 hover:text-ink transition-colors ${isFavorite ? "text-green" : ""}`}
          >
            <HeartIcon size={16} className={isFavorite ? "fill-red-500" : ""} />
            {isFavorite
              ? "Đã thêm vào mục yêu thích"
              : "Thêm vào mục yêu thích"}
          </button>
        </div>

        {/* Safe Checkout Badges */}
        <div>
          <div className="flex gap-2 justify-center">
            {[TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-[#f4f6f8] hover:bg-green hover:text-white flex items-center justify-center transition text-gray-700 shrink-0"
                >
                  <Icon size={20} />
                </a>
              ),
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mt-2 shadow-sm text-center">
          <div className="inline-block bg-ink text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-2">
            Đặt hàng nhanh 24/7
          </div>
          <div className="text-xl font-bold text-ink">19001234</div>
        </div>

        <p className="text-sm text-center pt-2">
          <TruckIcon size={20} className="inline mr-2" /> Giao hàng{" "}
          <strong>tận nơi</strong>
        </p>
      </div>
    </div>
  );
};
