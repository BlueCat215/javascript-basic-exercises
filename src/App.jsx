import React from "react";
import { Layout } from "./components/Layout";
import { StatCard } from "./components/StatCard";
import { Table } from "./components/Table";

export default function App() {
  const tableData = [
    {
      id: "TX-1029",
      customer: "Nguyễn Văn A",
      amount: "2,500,000 ₫",
      date: "30/07/2026",
      status: "Thành công",
    },
    {
      id: "TX-1030",
      customer: "Trần Thị B",
      amount: "850,000 ₫",
      date: "30/07/2026",
      status: "Đang xử lý",
    },
    {
      id: "TX-1031",
      customer: "Lê Văn C",
      amount: "12,000,000 ₫",
      date: "29/07/2026",
      status: "Thất bại",
    },
  ];

  const tableColumns = [
    { header: "Mã GD", accessor: "id" },
    { header: "Khách hàng", accessor: "customer" },
    { header: "Số tiền", accessor: "amount" },
    { header: "Ngày", accessor: "date" },
    {
      header: "Trạng thái",
      render: (row) => (
        <span
          className={`px-2.5 py-1  text-xs font-medium 
          ${
            row.status === "Thành công"
              ? "bg-green-100 text-green-700"
              : row.status === "Thất bại"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tổng quan hệ thống
          </h1>
          <p className="text-gray-500">
            Xin chào! Dưới đây là tình hình kinh doanh hôm nay.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Tổng doanh thu"
            value="128,500,000 ₫"
            trend="12.5%"
            trendUp={true}
            icon="💲"
          />
          <StatCard
            title="Người dùng mới"
            value="1,240"
            trend="8.2%"
            trendUp={true}
            icon="👥"
          />
          <StatCard
            title="Đơn hàng"
            value="385"
            trend="3.1%"
            trendUp={false}
            icon="📦"
          />
          <StatCard
            title="Tỷ lệ chuyển đổi"
            value="3.8%"
            trend="1.2%"
            trendUp={true}
            icon="⚡"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              Giao dịch gần đây
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Xem tất cả →
            </button>
          </div>

          <Table columns={tableColumns} data={tableData} />
        </div>
      </div>
    </Layout>
  );
}
