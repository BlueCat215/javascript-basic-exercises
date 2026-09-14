import { z } from "zod";
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Vui lòng nhập username")
    .min(3, "Nhập ít nhất 3 ký tự"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Ít nhất 6 ký tự"),
});
