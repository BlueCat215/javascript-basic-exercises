import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập họ"),
  lastName: z.string().min(1, "Vui lòng nhập tên"),
  company: z.string().optional(),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  street: z.string().min(1, "Vui lòng nhập địa chỉ"),
  streetOptional: z.string().optional(),
  city: z.string().min(1, "Vui lòng nhập thành phố"),
  state: z.string().min(1, "Vui lòng nhập tỉnh/thành"),
  zipCode: z.string().min(1, "Vui lòng nhập mã bưu điện"),
  phone: z.string().min(8, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  orderNotes: z.string().optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"], {
    required_error: "Chọn phương thức thanh toán",
  }),
});
