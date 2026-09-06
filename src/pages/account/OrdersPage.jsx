import { useAuthStore } from "../../store/useAuthStore";
import { useOrdersQuery } from "./hooks/useOrdersQuery";
import { LoadingState, EmptyState } from "../../components/StatusState";

const statusLabel = {
  pending: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function OrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading } = useOrdersQuery(user?.id);

  if (isLoading) return <LoadingState />;
  if (orders.length === 0)
    return <EmptyState message="Bạn chưa có đơn hàng nào" />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
      <h1 className="text-2xl font-display font-bold text-ink mb-4">
        Lịch sử đơn hàng
      </h1>

      {orders.map((order) => (
        <div key={order.id} className="border border-line rounded-tag p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-sm text-ink/60">
              Đơn #{order.id}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-tag bg-paper">
              {statusLabel[order.status] || order.status}
            </span>
          </div>
          <p className="text-xs text-ink/40 mb-2">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>
          <ul className="text-sm space-y-1">
            {order.products.map((p, idx) => (
              <li key={idx} className="flex justify-between">
                <span>
                  Sản phẩm #{p.productId} × {p.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
