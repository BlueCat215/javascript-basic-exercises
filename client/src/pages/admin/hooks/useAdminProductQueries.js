import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminProductService from "../services/adminProductService";
import toast from "react-hot-toast";

export const useAdminProductsQuery = (filters) => {
  return useQuery({
    queryKey: ["admin", "products", filters],
    queryFn: () => adminProductService.getAll(filters),
    placeholderData: (prev) => prev,
  });
};

export const useAdminCategoriesQuery = () => {
  return useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminProductService.getCategories,
    staleTime: 5 * 60 * 1000,
  });
};

const invalidate = (qc) =>
  qc.invalidateQueries({ queryKey: ["admin", "products"] });

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminProductService.create,
    onSuccess: () => {
      invalidate(qc);
      toast.success("Thêm sản phẩm thành công");
    },
    onError: () => toast.error("Thêm sản phẩm thất bại"),
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => adminProductService.update(id, data),
    onSuccess: () => {
      invalidate(qc);
      toast.success("Cập nhật thành công");
    },
    onError: () => toast.error("Cập nhật thất bại"),
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminProductService.remove,
    onSuccess: () => {
      invalidate(qc);
      toast.success("Đã xóa sản phẩm");
    },
    onError: () => toast.error("Xóa thất bại"),
  });
};
