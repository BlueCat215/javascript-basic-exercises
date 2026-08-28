import {
  getProducts,
  getProductsDetail,
  addProduct,
  updateProduct,
  patchItem,
  deleteProduct,
} from "../api/services/productService";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products", "list"],
    queryFn: () => getProducts(),
    staleTime: 1000 * 3,
    gcTime: 1000 * 3,
  });
};

export const useProductDetail = (id) => {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => getProductsDetail(id),
    enabled: !!id,
  });
};

export const useAddMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (obj) => addProduct(obj),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });
    },

    onError: (error) => {
      console.log("Tạo sản phẩm thất bại:", error);
    },
  });
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteProduct(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });
    },

    onError: (error) => {
      console.log("Xóa sản phẩm thất bại:", error);
    },
  });
};

export const useUpdateMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, obj }) => updateProduct(id, obj),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", "list"],
      });
    },
    onError: (error) => {
      console.log("Cập nhật sản phẩm thất bại:", error);
    },
  });
};

export const usePatchPriceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, item }) => patchItem(id, item),
    onSuccess: (item) => {
      queryClient.setQueryData(["products", "list"], (obj) =>
        obj.map((p) => (p.id === item.id ? { ...p, ...item } : p)),
      );
    },
    onError: (error) => {
      console.log("Cập nhật giá thất bại:", error);
    },
  });
};
