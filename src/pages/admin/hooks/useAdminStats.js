import { useQuery } from "@tanstack/react-query";
import statsService from "../services/statsService";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [productsRes, orders] = await Promise.all([
        statsService.getProductCount(),
        statsService.getAllOrders(),
      ]);
      // Doanh thu ước tính: tổng price*quantity của mọi sản phẩm trong mọi đơn (không tính giảm giá)
      // fetch chi tiết giá sản để chính xác — ở đây tạm bỏ qua giá lồng trong order nếu chưa lưu
      const revenue = orders.reduce((sum, obj) => sum + obj.total || 0, 0);
      return {
        productCount: productsRes.total,
        orderCount: orders.length,
        revenue,
      };
    },
  });
};
