import { useState, useEffect } from "react";
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
// mỗi lần value đổi, hủy timer cũ, đặt timer mới
// khi người dùng ngừng gõ đủ delay
// debouncedValue mới cập nhật để tránh gọi API mỗi ký tự gõ.
