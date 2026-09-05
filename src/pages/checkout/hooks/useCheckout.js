import { useMutation, useQueryClient } from "@tanstack/react-query";
import checkoutService from "../services/checkoutService";
export const useCheckout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkoutService.createOrder,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["cart", "active"] }),
  });
};
