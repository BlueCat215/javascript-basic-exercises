import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrdersQuery } from "./hooks/useOrdersQuery";
import { useProductListQuery } from "../../hooks/useProductListQuery";
import { LoadingState, EmptyState } from "../../components/StatusState";

const statusLabel = {
  pending: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};
const statusDotClass = {
  pending: "bg-gold",
  shipped: "bg-ink/40",
  completed: "bg-green",
  cancelled: "bg-rust",
};

const paymentLabel = {
  cod: "Tiền mặt khi nhận hàng",
  bank_transfer: "Chuyển khoản ngân hàng",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading } = useOrdersQuery(user?.id);
  // pageSize lớn để lấy toàn bộ sản phẩm phục vụ tra cứu tên/ảnh/giá cho
  // từng đơn hàng cũ (đơn hàng chỉ lưu productId + quantity).
  const { data: productsData } = useProductListQuery({
    page: 1,
    pageSize: 1000,
  });

  const productById = useMemo(() => {
    const map = new Map();
    (productsData?.items || []).forEach((p) => map.set(String(p.id), p));
    return map;
  }, [productsData]);

  if (isLoading) return <LoadingState />;
  if (orders.length === 0)
    return <EmptyState message="Bạn chưa có đơn hàng nào" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <h1 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wider mb-6 pb-4 border-b border-line">
        Lịch sử đơn hàng
      </h1>

      <div className="space-y-5">
        {[...orders]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((order) => {
            const computedTotal = order.products.reduce((sum, p) => {
              const product = productById.get(String(p.productId));
              return sum + (product?.price || 0) * p.quantity;
            }, 0);
            const total = order.total ?? computedTotal;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-line shadow-sm overflow-hidden"
              >
                {/* Header đơn hàng */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-line bg-paper/40">
                  <div className="space-y-1">
                    <h3 className="font-bold text-ink text-base sm:text-lg">
                      Đơn hàng #{order.id}
                    </h3>
                    <p className="text-sm text-ink/60">
                      Ngày đặt:{" "}
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                    {order.shippingInfo?.fullName && (
                      <p className="text-sm text-ink/60">
                        Người nhận: {order.shippingInfo.fullName}
                        {order.shippingInfo?.phone &&
                          ` · ${order.shippingInfo.phone}`}
                      </p>
                    )}
                    {(order.shippingInfo?.address ||
                      order.shippingInfo?.street) && (
                      <p className="text-sm text-ink/60">
                        Địa chỉ:{" "}
                        {order.shippingInfo.address ||
                          [
                            order.shippingInfo.street,
                            order.shippingInfo.city,
                            order.shippingInfo.state,
                            order.shippingInfo.zipCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                      </p>
                    )}
                    {order.paymentMethod && (
                      <p className="text-sm text-ink/60">
                        Thanh toán:{" "}
                        {paymentLabel[order.paymentMethod] ||
                          order.paymentMethod}
                      </p>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1.5 shrink-0 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border border-line bg-white text-ink/70">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusDotClass[order.status] || "bg-ink/30"}`}
                    />
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>

                {/* Danh sách sản phẩm — bấm vào để xem chi tiết sản phẩm */}
                <div className="divide-y divide-line">
                  {order.products.map((p, idx) => {
                    const product = productById.get(String(p.productId));
                    return (
                      <div
                        key={idx}
                        onClick={() => navigate(`/products/${p.productId}`)}
                        className="flex items-center gap-4 p-4 sm:p-5 hover:bg-paper cursor-pointer transition-colors"
                      >
                        <div className="w-14 h-14 shrink-0 bg-paper rounded-md border border-line overflow-hidden flex items-center justify-center p-1.5">
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-ink/30">?</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-ink truncate hover:text-green transition">
                            {product
                              ? product.title
                              : `Sản phẩm #${p.productId} (không còn tồn tại)`}
                          </p>
                          <p className="text-xs text-ink/50 mt-0.5">
                            Số lượng: {p.quantity}
                            {product && ` · $${product.price} / sản phẩm`}
                          </p>
                        </div>

                        {product && (
                          <span className="text-sm font-bold text-ink shrink-0">
                            ${(product.price * p.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Tổng tiền */}
                <div className="p-5 sm:p-6 border-t border-line flex justify-between items-center">
                  <span className="text-sm font-bold uppercase tracking-wider text-ink/60">
                    Tổng cộng
                  </span>
                  <span className="text-xl font-display font-black text-green">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
