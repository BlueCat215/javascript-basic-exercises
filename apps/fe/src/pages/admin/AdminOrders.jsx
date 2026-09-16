import { useState, useMemo } from "react";
import {
  useAdminOrdersQuery,
  useUpdateOrderStatus,
} from "./hooks/useAdminOrderQueries";
import { useAdminAccountsQuery } from "./hooks/useAdminAccountQueries";
import { useAdminProductsQuery } from "./hooks/useAdminProductQueries";
import { TableRowSkeleton } from "../../components/Skeleton";

const STATUS_OPTIONS = ["pending", "shipped", "completed", "cancelled"];

const statusLabel = {
  pending: "Đang xử lý",
  shipped: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

const statusBadgeClass = {
  pending: "bg-gold/20 text-gold",
  shipped: "bg-blue-100 text-blue-700",
  completed: "bg-green/20 text-green",
  cancelled: "bg-rust/20 text-rust",
};

function OrderDetailModal({ order, customerName, productById, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-tag p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="font-bold">Đơn hàng #{order.id}</h2>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-tag ${statusBadgeClass[order.status] || "bg-paper"}`}
          >
            {statusLabel[order.status] || order.status}
          </span>
        </div>

        <p className="text-xs text-ink/40">
          {new Date(order.createdAt).toLocaleString("vi-VN")}
        </p>

        <div className="text-sm space-y-1">
          <p>
            <span className="text-ink/50">Khách hàng: </span>
            {customerName || `#${order.userId}`}
          </p>
          {order.shippingInfo?.fullName && (
            <p>
              <span className="text-ink/50">Người nhận: </span>
              {order.shippingInfo.fullName}
            </p>
          )}
          {order.shippingInfo?.phone && (
            <p>
              <span className="text-ink/50">SĐT: </span>
              {order.shippingInfo.phone}
            </p>
          )}
          {(order.shippingInfo?.address || order.shippingInfo?.street) && (
            <p>
              <span className="text-ink/50">Địa chỉ: </span>
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
          <p>
            <span className="text-ink/50">Thanh toán: </span>
            {order.paymentMethod === "cod"
              ? "Tiền mặt khi nhận hàng"
              : order.paymentMethod === "bank_transfer"
                ? "Chuyển khoản"
                : order.paymentMethod || "—"}
          </p>
        </div>

        <div className="border-t border-line pt-3">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-2">
            Sản phẩm
          </p>
          <ul className="text-sm divide-y divide-line">
            {order.products.map((p) => {
              const product = productById.get(String(p.productId));
              return (
                <li key={p.productId} className="flex items-center gap-3 py-2">
                  {product?.image && (
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-10 h-10 rounded object-cover border border-line shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate">
                      {product
                        ? product.title
                        : `Sản phẩm #${p.productId} (không còn tồn tại)`}
                    </p>
                    {product && (
                      <p className="text-xs text-ink/40">
                        ${product.price} × {p.quantity}
                      </p>
                    )}
                    {!product && (
                      <p className="text-xs text-ink/40">
                        Số lượng: {p.quantity}
                      </p>
                    )}
                  </div>
                  {product && (
                    <span className="text-sm font-medium shrink-0">
                      ${(product.price * p.quantity).toFixed(2)}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex justify-between font-bold text-sm mt-3 pt-3 border-t border-line">
            <span>Tổng tiền</span>
            <span>{order.total !== undefined ? `$${order.total}` : "—"}</span>
          </div>
        </div>

        <button onClick={onClose} className="btn-secondary w-full">
          Đóng
        </button>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [columnFilters, setColumnFilters] = useState({
    keyword: "",
    status: "",
  });
  const [viewingOrderId, setViewingOrderId] = useState(null);
  const [pendingStatusId, setPendingStatusId] = useState(null);

  const {
    data: orders = [],
    isLoading,
    isError: isOrdersError,
  } = useAdminOrdersQuery();
  const { data: accounts = [], isError: isAccountsError } =
    useAdminAccountsQuery();
  // pageSize lớn để lấy toàn bộ sản phẩm phục vụ tra cứu tên/ảnh/giá trong đơn hàng
  const { data: productsData, isError: isProductsError } =
    useAdminProductsQuery({
      page: 1,
      pageSize: 1000,
    });
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const productById = useMemo(() => {
    const map = new Map();
    (productsData?.items || []).forEach((p) => map.set(String(p.id), p));
    return map;
  }, [productsData]);

  const accountNameById = useMemo(() => {
    const map = new Map();
    accounts.forEach((u) => {
      const fullName = [u.name?.firstname, u.name?.lastname]
        .filter(Boolean)
        .join(" ");
      map.set(u.id, fullName || u.username);
    });
    return map;
  }, [accounts]);

  const filtered = useMemo(() => {
    const keyword = columnFilters.keyword.trim().toLowerCase();
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((o) => {
        const matchStatus =
          !columnFilters.status || o.status === columnFilters.status;
        if (!keyword) return matchStatus;
        const customerName = accountNameById.get(o.userId) || "";
        const haystack = [
          String(o.id),
          customerName,
          o.shippingInfo?.fullName,
          o.shippingInfo?.phone,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return matchStatus && haystack.includes(keyword);
      });
  }, [orders, columnFilters, accountNameById]);

  const viewingOrder = useMemo(
    () => orders.find((o) => o.id === viewingOrderId) || null,
    [orders, viewingOrderId],
  );

  const handleStatusChange = (id, status) => {
    setPendingStatusId(id);
    updateStatus(
      { id, status },
      {
        onSettled: () => setPendingStatusId(null),
      },
    );
  };

  const hasLoadError = isOrdersError || isAccountsError || isProductsError;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold text-ink">
          Quản lý đơn hàng
        </h1>
      </div>

      {hasLoadError && (
        <div className="bg-rust/10 text-rust text-sm rounded-tag px-4 py-3">
          Đã xảy ra lỗi khi tải dữ liệu
          {isOrdersError && " đơn hàng"}
          {isAccountsError && " tài khoản"}
          {isProductsError && " sản phẩm"}. Vui lòng thử tải lại trang.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-line">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3">Mã đơn</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Sản phẩm</th>
              <th className="p-3">Ngày đặt</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
            <tr className="bg-white border-t border-line">
              <th className="p-2" colSpan={2}>
                <input
                  value={columnFilters.keyword}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, keyword: e.target.value }))
                  }
                  placeholder="Tìm theo mã đơn, tên KH, SĐT..."
                  className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
                />
              </th>
              <th className="p-2" />
              <th className="p-2" />
              <th className="p-2" />
              <th className="p-2">
                <select
                  value={columnFilters.status}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, status: e.target.value }))
                  }
                  className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
                >
                  <option value="">Tất cả</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
              </th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 7 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-ink/40">
                  Không có đơn hàng nào khớp
                </td>
              </tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id} className="border-t border-line">
                <td className="p-3 font-mono">#{o.id}</td>
                <td className="p-3">
                  {accountNameById.get(o.userId) || `#${o.userId}`}
                </td>
                <td className="p-3">
                  <div className="flex items-center -space-x-2">
                    {o.products.slice(0, 3).map((p) => {
                      const product = productById.get(String(p.productId));
                      return product?.image ? (
                        <img
                          key={p.productId}
                          src={product.image}
                          alt={product.title}
                          title={product.title}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <span
                          key={p.productId}
                          className="w-8 h-8 rounded-full border-2 border-white bg-paper flex items-center justify-center text-[10px] text-ink/40"
                        >
                          ?
                        </span>
                      );
                    })}
                    {o.products.length > 3 && (
                      <span className="w-8 h-8 rounded-full border-2 border-white bg-paper flex items-center justify-center text-[10px] text-ink/60">
                        +{o.products.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-xs text-ink/60">
                  {new Date(o.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 font-mono">
                  {o.total !== undefined ? `$${o.total}` : "—"}
                </td>
                <td className="p-3">
                  <select
                    value={o.status}
                    disabled={pendingStatusId === o.id}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className={`text-xs font-medium px-2 py-1 rounded-tag border-0 disabled:opacity-50 ${statusBadgeClass[o.status] || "bg-paper"}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel[s]}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => setViewingOrderId(o.id)}
                    className="text-gold hover:underline"
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingOrder && (
        <OrderDetailModal
          order={viewingOrder}
          customerName={accountNameById.get(viewingOrder.userId)}
          productById={productById}
          onClose={() => setViewingOrderId(null)}
        />
      )}
    </div>
  );
}
