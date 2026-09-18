export const PaymentMethodSelector = ({ register, error }) => {
  return (
    <div className="space-y-3 pt-2 border-t border-line">
      <p className="text-xs font-bold text-ink uppercase tracking-wider">
        Phương thức thanh toán
      </p>
      <label className="flex items-center gap-3 cursor-pointer bg-white p-3.5 rounded border border-line hover:border-ink transition-colors">
        <input
          type="radio"
          value="cod"
          {...register("paymentMethod")}
          className="text-ink focus:ring-0 h-4 w-4"
        />
        <span className="text-xs font-bold text-ink">
          Thanh toán khi nhận hàng (COD)
        </span>
      </label>
      <label className="flex items-center gap-3 cursor-pointer bg-white p-3.5 rounded border border-line hover:border-ink transition-colors">
        <input
          type="radio"
          value="bank_transfer"
          {...register("paymentMethod")}
          className="text-ink focus:ring-0 h-4 w-4"
        />
        <span className="text-xs font-bold text-ink">
          Chuyển khoản ngân hàng
        </span>
      </label>
      {error && <p className="text-rust text-[11px]">{error}</p>}
    </div>
  );
};
