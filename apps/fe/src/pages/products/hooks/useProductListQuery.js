import { useQuery } from "@tanstack/react-query";
import productListService from "../services/productListService";

export const useProductListQuery = (filters) => {
  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: () => productListService.getProducts(filters),
    staleTime: 1000 * 60,
    placeholderData: (prev) => prev, // giữ data trang cũ khi chuyển trang
  });
};

export const useBrandsQuery = () => {
  return useQuery({
    queryKey: ["products", "brands"],
    queryFn: productListService.getBrands,
    staleTime: 1000 * 60 * 30,
  });
};
