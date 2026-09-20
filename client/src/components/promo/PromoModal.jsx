import { Link } from "react-router-dom";
import { CloseIcon } from "../icons";
import { imageUrl } from "../../utils/imageUrl";

export const PromoModal = ({ promoProduct, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />

      <div className="relative flex flex-col items-center max-w-[80vw]">
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full shadow flex items-center justify-center text-ink/60 z-10"
        >
          <CloseIcon size={13} />
        </button>

        <Link
          to={promoProduct ? `/products/${promoProduct.id}` : "/products"}
          onClick={onClose}
          className="block active:scale-95 transition"
        >
          <img
            src={imageUrl(promoProduct.image)}
            alt={promoProduct.title || "Sản phẩm khuyến mãi"}
            draggable={false}
            className="w-64 h-64 object-contain drop-shadow-2xl"
          />
        </Link>

        <p className="mt-2 text-center text-white font-display font-black text-xl drop-shadow-md">
          Giảm ngay 10% <span className="text-[#F1DC67]">- Mã: SALE10</span>
        </p>
        <p className="text-white/80 text-xs mt-1 drop-shadow">
          Bấm vào ảnh để mua ngay
        </p>
      </div>
    </div>
  );
};
