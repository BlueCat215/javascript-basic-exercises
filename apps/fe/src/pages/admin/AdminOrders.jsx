import { useState, useMemo } from "react";
import {
  useAdminOrdersQuery,
  useUpdateOrderStatus,
} from "./hooks/useAdminOrderQueries";
import { useAdminAccountsQuery } from "./hooks/useAdminAccountQueries";
import { useAdminProductsQuery } from "./hooks/useAdminProductQueries";
import { TableRowSkeleton } from "../../components/Skeleton";
import { imageUrl } from "../../utils/imageUrl";

const STATUS_OPTIONS = ["pending", "shipped", "completed", "cancelled"];

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

const filterInputClass =
  "w-full border-b border-line bg-transparent py-1 text-xs font-normal focus:outline-none focus:border-gold transition-colors";

function OrderDetailPanel({ order, customerName, productById, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg h-full bg-surface border-l border-line flex flex-col">
        <div className="flex items-center justify-between px-6 h-14 border-b border-line shrink-0">
          <h2 className="font-display font-semibold text-ink">
            Đơn hàng #{order.id}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs text-ink/60">
            <span
              className={`w-1.5 h-1.5 rounded-full ${statusDotClass[order.status] || "bg-ink/30"}`}
            />
            {statusLabel[order.status] || order.status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          <p className="text-xs text-ink/40">
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </p>

          <div className="text-sm space-y-2">
            <p>
              <span className="text-ink/45">Khách hàng </span>
              {customerName || `#${order.userId}`}
            </p>
            {order.shippingInfo?.fullName && (
              <p>
                <span className="text-ink/45">Người nhận </span>
                {order.shippingInfo.fullName}
              </p>
            )}
            {order.shippingInfo?.phone && (
              <p>
                <span className="text-ink/45">SĐT </span>
                {order.shippingInfo.phone}
              </p>
            )}
            {(order.shippingInfo?.address || order.shippingInfo?.street) && (
              <p>
                <span className="text-ink/45">Địa chỉ </span>
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
              <span className="text-ink/45">Thanh toán </span>
              {order.paymentMethod === "cod"
                ? "Tiền mặt khi nhận hàng"
                : order.paymentMethod === "bank_transfer"
                  ? "Chuyển khoản"
                  : order.paymentMethod || "—"}
            </p>
          </div>

          <div className="border-t border-line pt-4">
            <p className="text-sm font-medium text-ink mb-2">Sản phẩm</p>
            <ul className="text-sm divide-y divide-line">
              {order.products.map((p) => {
                const product = productById.get(String(p.productId));
                return (
                  <li
                    key={p.productId}
                    className="flex items-center gap-3 py-3"
                  >
                    {product?.image && (
                      <img
                        src={imageUrl(product.image)}
                        alt={product.title}
                        className="w-10 h-10 object-cover border border-line shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate">
                        {product
                          ? product.title
                          : `Sản phẩm #${p.productId} (không còn tồn tại)`}
                      </p>
                      {product && (
                        <p className="text-xs text-ink/40 font-mono">
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
                      <span className="text-sm font-mono shrink-0">
                        ${(product.price * p.quantity).toFixed(2)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="flex justify-between font-medium text-sm mt-3 pt-3 border-t border-line">
              <span>Tổng tiền</span>
              <span className="font-mono">
                {order.total !== undefined ? `$${order.total}` : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-line shrink-0">
          <button
            onClick={onClose}
            className="text-sm text-ink/60 hover:text-ink"
          >
            Đóng
          </button>
        </div>
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
    updateStatus({ id, status }, { onSettled: () => setPendingStatusId(null) });
  };

  const hasLoadError = isOrdersError || isAccountsError || isProductsError;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-ink/50">Quản trị</p>
        <h1 className="text-xl font-display font-semibold text-ink mt-1">
          Đơn hàng
        </h1>
      </div>

      {hasLoadError && (
        <div className="border-l-2 border-rust bg-rust/5 text-rust text-sm px-4 py-3">
          Đã xảy ra lỗi khi tải dữ liệu
          {isOrdersError && " đơn hàng"}
          {isAccountsError && " tài khoản"}
          {isProductsError && " sản phẩm"}. Vui lòng thử tải lại trang.
        </div>
      )}

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3 font-medium text-ink/60">Mã đơn</th>
              <th className="p-3 font-medium text-ink/60">Khách hàng</th>
              <th className="p-3 font-medium text-ink/60">Sản phẩm</th>
              <th className="p-3 font-medium text-ink/60">Ngày đặt</th>
              <th className="p-3 font-medium text-ink/60">Tổng tiền</th>
              <th className="p-3 font-medium text-ink/60">Trạng thái</th>
              <th className="p-3 font-medium text-ink/60">Hành động</th>
            </tr>
            <tr className="bg-surface border-t border-line">
              <th className="p-2 font-normal" colSpan={2}>
                <input
                  value={columnFilters.keyword}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, keyword: e.target.value }))
                  }
                  placeholder="Tìm theo mã đơn, tên KH, SĐT..."
                  className={filterInputClass}
                />
              </th>
              <th className="p-2" />
              <th className="p-2" />
              <th className="p-2" />
              <th className="p-2 font-normal">
                <select
                  value={columnFilters.status}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, status: e.target.value }))
                  }
                  className={filterInputClass}
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
          <tbody className="divide-y divide-line">
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
              <tr key={o.id}>
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
                          src={imageUrl(product.image)}
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
                    className="text-xs bg-transparent border-b border-line focus:outline-none focus:border-gold disabled:opacity-50 py-1"
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
        <OrderDetailPanel
          order={viewingOrder}
          customerName={accountNameById.get(viewingOrder.userId)}
          productById={productById}
          onClose={() => setViewingOrderId(null)}
        />
      )}
    </div>
  );
}
