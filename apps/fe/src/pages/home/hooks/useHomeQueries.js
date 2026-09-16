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

export const usePromoProducts = () => {
  return useQuery({
    queryKey: ["products", "promo"],
    queryFn: () => homeService.getProducts({ sort: "price_asc", pageSize: 1 }),
    staleTime: 1000 * 60 * 5,
  });
};

export const useRecommendedProducts = (tab) => {
  return useQuery({
    queryKey: ["products", "recommended", tab],
    queryFn: () => homeService.getRecommended(tab, 5),
    enabled: !!tab,
    staleTime: 1000 * 60 * 5,
  });
};

export const useClearanceProducts = () => {
  return useQuery({
    queryKey: ["products", "clearance"],
    queryFn: () => homeService.getClearance(5),
    staleTime: 1000 * 60 * 5,
  });
};

export const useNewArrivalProducts = (tab) => {
  return useQuery({
    queryKey: ["products", "new-arrival", tab],
    queryFn: () => homeService.getNewArrival(tab, 8),
    enabled: !!tab,
    staleTime: 1000 * 60 * 5,
  });
};

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles", "home"],
    queryFn: () => homeService.getArticles(5),
    staleTime: 1000 * 60 * 10,
  });
};

export const usePublicStats = () => {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: async () => {
      const [productsRes, categories] = await Promise.all([
        homeService.getProducts({ page: 1, pageSize: 1 }),
        homeService.getCategories(),
      ]);
      return {
        productCount: productsRes.total,
        categoryCount: categories.length,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
};

// dùng useQueries (số nhiều) thay vì gọi useQuery trong vòng lặp?
// Hook không được gọi trong loop/điều kiện (vi phạm Rules of Hooks)
// — useQueries là API chính thức của TanStack Query
// cho đúng tình huống "cần N query độc lập với số lượng động"
// (ở đây N = số danh mục, không biết trước).
