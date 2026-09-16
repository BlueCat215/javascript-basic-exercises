import { z } from "zod";

export const profileSchema = z.object({
  name: z.object({
    firstname: z.string().min(1, "Vui lòng nhập họ"),
    lastname: z.string().min(1, "Vui lòng nhập tên"),
  }),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
});

export const addressSchema = z.object({
  city: z.string().min(1, "Vui lòng nhập một thành phố"),
  street: z.string().min(1, "Vui lòng nhập đại chỉ"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng nhâp lại mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
