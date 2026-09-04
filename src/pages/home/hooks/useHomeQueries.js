import { useQuery, useQueries } from "@tanstack/react-query";
import homeService from "../services/homeService";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: homeService.getCategories,
    staleTime: 1000 * 60 * 30,
  });
};

export const useProductsByCategories = (categories) => {
  return useQueries({
    queries: categories.map((category) => ({
      queryKey: ["products", "category", category, "home"],
      queryFn: () => homeService.getProductsByCategory(category, 4),
      enabled: !!category,
      staleTime: 1000 * 60 * 5,
    })),
  });
};

// dùng useQueries (số nhiều) thay vì gọi useQuery trong vòng lặp?
// Hook không được gọi trong loop/điều kiện (vi phạm Rules of Hooks)
// — useQueries là API chính thức của TanStack Query
// cho đúng tình huống "cần N query độc lập với số lượng động"
// (ở đây N = số danh mục, không biết trước).
