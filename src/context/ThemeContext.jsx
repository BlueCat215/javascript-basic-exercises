import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // tránh flash of wrong theme (nói kỹ ở phần lỗi bên dưới)
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e) => {
      //lắng nghe sự kiện storage (localStorage & sessionStorage )
      if (e.key === "theme" && e.newValue) setTheme(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const t = useContext(ThemeContext);
  if (t === undefined) {
    throw new Error("useTheme phải được dùng bên trong <ThemeProvider>");
  }
  return t;
};
