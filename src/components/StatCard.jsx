import React from "react";

export const StatCard = ({ title, value, icon, trend, trendUp = true }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between transition-transform hover:-translate-y-3.5">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        {trend && (
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${trendUp ? "text-green-600" : "text-red-600"}`}
          >
            {trendUp ? "↑" : "↓"} {trend}
            <span className="text-gray-400 ml-1">so với tháng trước</span>
          </p>
        )}
      </div>
      <div
        className={`p-4 rounded-full ${trendUp ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"}`}
      >
        {icon}
      </div>
    </div>
  );
};
