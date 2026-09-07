import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminAccountService from "../services/adminAccountService";
import toast from "react-hot-toast";

export const useAdminAccountsQuery = () => {
  return useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: adminAccountService.getAll,
  });
};

export const useToggleLockAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isLocked }) =>
      adminAccountService.update(id, { isLocked }),
    onMutate: async ({ id, isLocked }) => {
      await qc.cancelQueries({ queryKey: ["admin", "accounts"] });
      const previous = qc.getQueryData(["admin", "accounts"]);
      qc.setQueryData(["admin", "accounts"], (old = []) =>
        old.map((u) => (u.id === id ? { ...u, isLocked } : u)),
      );
      return { previous };
    },
    onError: (ctx) =>
      ctx?.previous && qc.setQueryData(["admin", "accounts"], ctx.previous),
    onSettled: () => qc.invalidateQueries({ queryKey: ["admin", "accounts"] }),
  });
};

export const useDeleteAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminAccountService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "accounts"] });
      toast.success("Đã xóa tài khoản");
    },
  });
};
