import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import favoriteService from "../services/favoriteService";
import { useAuthStore } from "../../../store/useAuthStore";

export const useFavoritesQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ["favorites"],
    queryFn: favoriteService.getAll,
    enabled: isAuthenticated,
  });
};

export const useIsFavorite = (productId) => {
  const { data: favorites = [] } = useFavoritesQuery();
  return favorites.some((f) => f.productId === productId);
};

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId }) => favoriteService.add(productId),
    onMutate: async ({ productId, product }) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData(["favorites"]);

      queryClient.setQueryData(["favorites"], (old = []) => [
        ...old,
        { id: `optimistic-${productId}`, productId, product },
      ]);

      return previous;
    },
    onError: (context) => {
      if (context?.previous)
        queryClient.setQueryData(["favorites"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) => favoriteService.remove(productId),
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: ["favorites"] });
      const previous = queryClient.getQueryData(["favorites"]);

      queryClient.setQueryData(["favorites"], (old = []) => {
        old.filter((f) => f.productId !== productId);
      });
      return { previous };
    },
    onError: (context) => {
      if (context?.previous)
        queryClient.setQueryData(["favorites"], context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
};
