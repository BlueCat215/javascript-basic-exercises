import { z } from "zod";
export const checkoutSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ giao hàng"),
  paymentMethod: z.enum(["cod", "bank"], {
    required_error: "Chọn phương thức thanh toán",
  }),
});
