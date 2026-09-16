import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên"),
  lastName: z.string().min(1, "Vui lòng nhập họ"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  country: z.string().min(1, "Vui lòng chọn quốc gia"),
  subject: z.string().optional(),
  message: z.string().min(10, "Nội dung tin nhắn ít nhất 10 ký tự"),
  agreeTerms: z
    .boolean()
    .refine((v) => v === true, { message: "Vui lòng đồng ý điều khoản" }),
});
