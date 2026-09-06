import { useQuery } from "@tanstack/react-query";
import orderService from "../services/orderService";

export const useOrdersQuery = (userId) => {
  return useQuery({
    queryKey: ["orders", userId],
    queryFn: () => orderService.getMine(userId),
    enabled: !!userId,
  });
};
