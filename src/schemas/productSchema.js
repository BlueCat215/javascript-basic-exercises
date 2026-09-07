import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Tên sản phẩm không được để trống")
    .max(100, "Tên quá dài"),
  price: z.coerce
    .number({ invalid_type_error: "Giá phải là số" })
    .positive("Giá phải lớn hơn 0"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  image: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
  description: z.string().max(500, "Mô tả tối đa 500 ký tự").optional(),
});
