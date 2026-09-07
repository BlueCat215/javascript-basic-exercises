import { useAdminStats } from "./hooks/useAdminStats";

const StatCard = ({ label, value }) => (
  <div className="border border-line rounded-tag p-5 bg-white">
    <p className="text-xs font-mono uppercase tracking-widest text-ink/40">
      {label}
    </p>
    <p className="text-3xl font-display font-bold text-ink mt-2">{value}</p>
  </div>
);

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  if (isLoading) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-ink">Tổng quan</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Sản phẩm" value={data.productCount} />
        <StatCard label="Đơn hàng" value={data.orderCount} />
        <StatCard label="Doanh thu" value={`$${data.revenue.toFixed(2)}`} />
      </div>
    </div>
  );
}
