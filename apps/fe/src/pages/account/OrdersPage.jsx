import { useAuthStore } from "../../store/useAuthStore";
import { useOrdersQuery } from "./hooks/useOrdersQuery";
import { LoadingState, EmptyState } from "../../components/StatusState";

const statusLabel = {
  pending: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};
const statusColors = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-800 border-rose-200",
};

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading } = useOrdersQuery(user?.id);

  if (isLoading) return <LoadingState />;
  if (orders.length === 0)
    return <EmptyState message="Bạn chưa có đơn hàng nào" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
      <h1 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wider mb-6 pb-4 border-b border-line">
        Lịch sử đơn hàng
      </h1>

      <div className="bg-white rounded border border-line shadow-sm overflow-hidden">
        <div className="divide-y divide-line">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-ink text-base sm:text-lg">
                    Đơn hàng #{order.id}
                  </h3>
                  <p className="text-sm text-ink/60 mt-1">
                    Ngày đặt:{" "}
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span
                  className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded border ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                >
                  {statusLabel[order.status] || order.status}
                </span>
              </div>

              <div className="bg-neutral-50 rounded border border-line/60 p-4">
                <p className="text-xs font-bold text-ink/60 uppercase tracking-wider mb-3 border-b border-line/60 pb-2">
                  Chi tiết sản phẩm
                </p>
                <ul className="text-sm space-y-2">
                  {order.products.map((p, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center font-medium text-ink"
                    >
                      <span>Sản phẩm ID: #{p.productId}</span>
                      <span className="text-ink/60">
                        Số lượng:{" "}
                        <strong className="text-ink">{p.quantity}</strong>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
