import { PaymentMethodSelector } from "./PaymentMethodSelector";

export const OrderSummary = ({
  items,
  subtotal,
  discount,
  total,
  voucher,
  register,
  errors,
  isPending,
}) => {
  return (
    <div className="lg:col-span-5">
      <div className="bg-neutral-50 rounded border border-line p-6 sticky top-6 space-y-6">
        <h2 className="text-base font-bold text-ink uppercase tracking-wider pb-3 border-b border-line">
          2. Đơn hàng của bạn
        </h2>

        <div className="flex justify-between items-center text-[11px] font-bold tracking-wider text-ink/50 uppercase">
          <span>Sản phẩm</span>
          <span>Tạm tính</span>
        </div>

        <div className="py-2 border-b border-line max-h-60 overflow-y-auto space-y-3 hide-scrollbar">
          {items.map((i) => (
            <div
              key={i.productId}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={i.product?.image}
                  alt={i.product?.title}
                  className="w-12 h-12 object-contain rounded border border-line bg-white shrink-0 p-1"
                />
                <div>
                  <h4 className="text-xs font-bold text-ink leading-snug line-clamp-1">
                    {i.product?.title}
                  </h4>
                  <span className="text-xs text-ink/50 block mt-0.5">
                    Số lượng: {i.quantity}
                  </span>
                </div>
              </div>
              <div className="text-xs font-bold text-ink text-right whitespace-nowrap pt-1">
                ${(i.product?.price * i.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 text-sm border-b border-line pb-4">
          <div className="flex justify-between items-center">
            <span className="text-ink/60">Tạm tính</span>
            <span className="font-bold text-ink">${subtotal.toFixed(2)}</span>
          </div>
          {voucher && (
            <div className="flex justify-between items-center text-green">
              <span className="font-medium">Giảm giá ({voucher.code})</span>
              <span className="font-bold">-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-1">
          <span className="text-base font-bold text-ink uppercase tracking-wider">
            Tổng cộng
          </span>
          <span className="text-2xl font-display font-bold text-green">
            ${total.toFixed(2)}
          </span>
        </div>

        <PaymentMethodSelector
          register={register}
          error={errors.paymentMethod?.message}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-ink hover:bg-ink/80 text-white py-3.5 rounded text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50 mt-4 shadow-sm"
        >
          {isPending ? "Đang xử lý..." : "Xác nhận đặt hàng"}
        </button>
      </div>
    </div>
  );
};
