import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminContactService from "../services/adminContactService";
import toast from "react-hot-toast";

export const useAdminContactMessagesQuery = () => {
  return useQuery({
    queryKey: ["admin", "contact-messages"],
    queryFn: adminContactService.getAll,
  });
};

const invalidate = (qc) =>
  qc.invalidateQueries({ queryKey: ["admin", "contact-messages"] });

export const useMarkContactMessageRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isRead }) => adminContactService.markRead(id, isRead),
    onMutate: async ({ id, isRead }) => {
      await qc.cancelQueries({ queryKey: ["admin", "contact-messages"] });
      const previous = qc.getQueryData(["admin", "contact-messages"]);
      qc.setQueryData(["admin", "contact-messages"], (old = []) =>
        old.map((m) => (m.id === id ? { ...m, isRead } : m)),
      );
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous)
        qc.setQueryData(["admin", "contact-messages"], ctx.previous);
    },
    onSettled: () => invalidate(qc),
  });
};

export const useDeleteContactMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: adminContactService.remove,
    onSuccess: () => {
      invalidate(qc);
      toast.success("Đã xóa tin nhắn");
    },
    onError: () => toast.error("Xóa tin nhắn thất bại"),
  });
};
