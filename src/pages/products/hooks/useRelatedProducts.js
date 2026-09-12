import { useQuery } from "@tanstack/react-query";
import productListService from "../services/productListService";

export const useRelatedProducts = (category, excludeId) => {
  return useQuery({
    queryKey: ["products", "related", category, excludeId],
    queryFn: () => productListService.getProducts({ category, pageSize: 6 }),
    enabled: !!category,
    select: (data) =>
      data.items.filter((p) => String(p.id) !== String(excludeId)).slice(0, 5),
  });
};
