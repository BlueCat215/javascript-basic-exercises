import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";
import {
  useActiveCart,
  useUpdateCartQuantity,
  useRemoveFromCart,
  useClearCart,
} from "./hooks/useCartQueries";
import { useApplyVoucher } from "./hooks/useVoucher";
import { LoadingState } from "../../components/StatusState";
import { Breadcrumb } from "../../components/Breadcrumb";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  TruckIcon,
} from "../../components/icons";

export default function CartPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: cart, isLoading } = useActiveCart({ enabled: isAuthenticated });
  const { mutate: updateQty } = useUpdateCartQuantity();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: clearCart } = useClearCart();
  const { mutate: applyVoucher, isPending: isApplying } = useApplyVoucher();

  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center space-y-4">
        <p className="text-ink/70">Vui lòng đăng nhập để xem giỏ hàng.</p>
        <button onClick={() => navigate("/login")} className="btn-primary">
          Đăng nhập
        </button>
      </div>
    );
  }

  if (isLoading) return <LoadingState />;

  const items = cart?.products || [];
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0,
  );
  const discount = voucher ? (subtotal * voucher.discountPercent) / 100 : 0;
  const total = subtotal - discount;

  const handleApplyVoucher = () => {
    applyVoucher(voucherCode, {
      onSuccess: (data) => {
        setVoucher(data);
        toast.success(`Áp dụng mã ${data.code} thành công`);
      },
      onError: () => {
        setVoucher(null);
        toast.error("Mã giảm giá không hợp lệ");
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} />

      {items.length === 0 ? (
        <div className="bg-white border border-line rounded-lg py-20 text-center">
          <p className="text-ink/50 mb-4">Giỏ hàng của bạn đang trống.</p>
          <button onClick={() => navigate("/products")} className="btn-primary">
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cột trái */}
          <section className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="bg-white rounded-lg border border-line p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-center hover:border-green/40 transition"
              >
                <div className="w-full sm:w-32 h-32 shrink-0 bg-paper rounded-md border border-line overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={item.product?.image}
                    alt={item.product?.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-grow flex flex-col justify-between w-full h-full">
                  <div>
                    <h3
                      className="text-sm font-bold text-ink hover:text-green transition cursor-pointer line-clamp-2"
                      onClick={() => navigate(`/products/${item.productId}`)}
                    >
                      {item.product?.title}
                    </h3>
                    <div className="text-lg font-display font-extrabold text-green mt-1.5">
                      ${item.product?.price}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="flex items-center border border-line rounded-md bg-white">
                      <button
                        onClick={() =>
                          updateQty({
                            productId: item.productId,
                            quantity: item.quantity - 1,
                          })
                        }
                        className="px-3 py-1.5 text-ink/50 hover:text-green transition"
                      >
                        <MinusIcon size={13} />
                      </button>
                      <span className="px-3 py-1.5 text-xs font-bold text-ink min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty({
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          })
                        }
                        className="px-3 py-1.5 text-ink/50 hover:text-green transition"
                      >
                        <PlusIcon size={13} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="flex items-center gap-1 text-xs text-rust hover:underline ml-auto"
                    >
                      <TrashIcon size={14} /> Xóa
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-green">
                    <CheckCircleIcon size={14} className="fill-green/20" /> Còn
                    hàng
                  </div>
                </div>
              </article>
            ))}

            <button
              onClick={() => clearCart()}
              className="text-xs text-rust hover:underline"
            >
              Xóa toàn bộ giỏ hàng
            </button>
          </section>

          {/* CỘT PHẢI */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-lg border-2 border-green/80 p-6 shadow-sm space-y-5">
              <h2 className="text-lg font-display font-bold text-ink pb-4 border-b border-line">
                Tóm tắt đơn hàng
              </h2>

              <div className="flex gap-2">
                <input
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã giảm giá"
                  className="flex-1 border border-line rounded-full px-4 py-2 text-sm"
                />
                <button
                  onClick={handleApplyVoucher}
                  disabled={isApplying || !voucherCode}
                  className="btn-secondary text-xs px-4 disabled:opacity-50"
                >
                  Áp dụng
                </button>
              </div>

              <div className="space-y-3 py-4 border-y border-line text-sm">
                <div className="flex justify-between text-ink/60">
                  <span>Tạm tính</span>
                  <span className="font-bold text-ink">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                {voucher && (
                  <div className="flex justify-between text-green">
                    <span>
                      Giảm giá ({voucher.discountPercent}% — {voucher.code})
                    </span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm font-extrabold uppercase tracking-wider text-ink">
                  Tổng cộng
                </span>
                <span className="text-2xl font-display font-black text-ink">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout", { state: { voucher } })}
                className="btn-primary w-full"
              >
                Tiến hành thanh toán
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink/40 pt-2">
                <TruckIcon size={13} /> Miễn phí vận chuyển đơn từ $199
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
