import { z } from "zod";

export const profileSchema = z.object({
  name: z.object({
    firstname: z.string().min(1, "Vui lòng nhập tên"),
    lastname: z.string().min(1, "Vui lòng nhập họ"),
  }),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  address: z
    .object({
      city: z.string().optional(),
      street: z.string().optional(),
    })
    .optional(),
});
