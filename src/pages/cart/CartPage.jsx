// pages/cart/CartPage.jsx
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
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-2xl font-display font-bold text-ink">
        Giỏ hàng của bạn
      </h1>

      {items.length === 0 ? (
        <p className="text-ink/50 text-center py-16">Giỏ hàng trống.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border border-line rounded-tag p-4"
              >
                <img
                  src={item.product?.image}
                  alt={item.product?.title}
                  className="w-16 h-16 object-contain"
                />
                <div className="flex-1">
                  <p className="font-medium text-ink line-clamp-1">
                    {item.product?.title}
                  </p>
                  <p className="font-mono text-sm text-ink/60">
                    ${item.product?.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQty({
                          productId: item.productId,
                          quantity: item.quantity - 1,
                        })
                      }
                      className="w-7 h-7 border border-line rounded"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-mono">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQty({
                          productId: item.productId,
                          quantity: item.quantity + 1,
                        })
                      }
                      className="w-7 h-7 border border-line rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="ml-auto text-xs text-rust hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value)}
              placeholder="Nhập mã giảm giá"
              className="flex-1 border border-line rounded-tag px-3 py-2 text-sm"
            />
            <button
              onClick={handleApplyVoucher}
              disabled={isApplying || !voucherCode}
              className="btn-secondary disabled:opacity-50"
            >
              Áp dụng
            </button>
          </div>

          <div className="border-t border-line pt-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {voucher && (
              <div className="flex justify-between text-gold">
                <span>Giảm giá ({voucher.discountPercent}%)</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t border-line">
              <span>Tổng cộng</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => clearCart()}
              className="btn-secondary flex-1"
            >
              Xóa hết
            </button>
            <button
              onClick={() => navigate("/checkout", { state: { voucher } })}
              className="btn-primary flex-1"
            >
              Tiến hành thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
}
