import { z } from "zod";

export const createAccountSchema = z.object({
  username: z.string().min(3, "Username ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu ít nhất 6 ký tự"),
  role: z.enum(["admin", "customer"]),
});

export const editAccountSchema = z.object({
  name: z.object({
    firstname: z.string().min(1, "Vui lòng nhập họ"),
    lastname: z.string().min(1, "Vui lòng nhập tên"),
  }),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["admin", "customer"]),
});
