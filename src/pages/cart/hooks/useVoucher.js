import { useMutation } from "@tanstack/react-query";
import voucherService from "../services/voucherService";
export const useApplyVoucher = () =>
  useMutation({
    mutationFn: voucherService.apply,
  });
