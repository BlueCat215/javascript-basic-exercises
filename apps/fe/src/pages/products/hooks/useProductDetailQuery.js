import { useQuery } from "@tanstack/react-query";
import productDetailService from "../services/productDetailService";

export const useProductDetailQuery = (id) => {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => productDetailService.getById(id),
    enabled: !!id,
  });
};
