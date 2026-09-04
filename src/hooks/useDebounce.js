import { useEffect } from "react";
import { useState } from "react";

export default function useDebounce(value, delay = 5000) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
// mỗi lần value đổi (gõ phím), hủy timer cũ, đặt timer mới —
// chỉ khi người dùng ngừng gõ đủ delay ms,
// debouncedValue mới cập nhật → tránh gọi API mỗi ký tự gõ.
