import { useAdminStats } from "./hooks/useAdminStats";

const StatBlock = ({ label, value, emphasis = false }) => (
  <div className="flex-1 px-6 py-5">
    <p className="text-sm text-ink/50">{label}</p>
    <p
      className={`font-mono font-semibold text-ink mt-2 ${
        emphasis ? "text-3xl" : "text-2xl"
      }`}
    >
      {value}
    </p>
  </div>
);

export default function AdminDashboard() {
  const { data, isLoading } = useAdminStats();

  if (isLoading) return <p className="text-sm text-ink/50">Đang tải...</p>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-ink/50">Tổng quan</p>
        <h1 className="text-2xl font-display font-semibold text-ink mt-1">
          Hoạt động cửa hàng
        </h1>
      </div>

      <div className="border border-line divide-y divide-line sm:divide-y-0 sm:divide-x sm:flex">
        <StatBlock
          label="Doanh thu"
          value={`$${data.revenue.toFixed(2)}`}
          emphasis
        />
        <StatBlock label="Đơn hàng" value={data.orderCount} />
        <StatBlock label="Sản phẩm" value={data.productCount} />
      </div>
    </div>
  );
}
