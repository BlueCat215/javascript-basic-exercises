import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import cartService from "../services/cartService";

export const useActiveCart = (options = {}) => {
  return useQuery({
    queryKey: ["cart", "active"],
    queryFn: cartService.getActiveCart,
    enabled: options.enabled ?? true,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartService.addItem(productId, quantity),
    onSuccess: (data) => queryClient.setQueryData(["cart", "active"], data),
  });
};

export const useUpdateCartQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }) =>
      cartService.updateItemQuantity(productId, quantity),
    onSuccess: (data) => queryClient.setQueryData(["cart", "active"], data),
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => cartService.removeItem(productId),
    onSuccess: (data) => queryClient.setQueryData(["cart", "active"], data),
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cartService.clearCart,
    onSuccess: (data) => queryClient.setQueryData(["cart", "active"], data),
  });
};
