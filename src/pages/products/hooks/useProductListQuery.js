import { useQuery } from "@tanstack/react-query";
import productListService from "../services/productListService";

export const useProductListQuery = (filters) => {
  return useQuery({
    queryKey: ["products", "list", filters], // filters đổi -> key đổi -> tự fetch lại
    queryFn: () => productListService.getProducts(filters),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev, // giữ data trang cũ khi chuyển trang, tránh giật trắng
  });
};
