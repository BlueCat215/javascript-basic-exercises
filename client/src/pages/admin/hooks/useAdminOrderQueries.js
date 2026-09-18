import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminOrderService from "../services/adminOrderService";
import toast from "react-hot-toast";

export const useAdminOrdersQuery = () => {
  return useQuery({
    queryKey: ["admin", "orders"],
    queryFn: adminOrderService.getAll,
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => adminOrderService.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["admin", "orders"] });
      const previous = qc.getQueryData(["admin", "orders"]);
      qc.setQueryData(["admin", "orders"], (old = []) =>
        old.map((o) => (o.id === id ? { ...o, status } : o)),
      );
      return { previous };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(["admin", "orders"], ctx.previous);
      toast.error(
        error.response?.data?.message || "Cập nhật trạng thái thất bại",
      );
    },
    onSuccess: () => toast.success("Đã cập nhật trạng thái đơn hàng"),
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "orders"] }),
  });
};
