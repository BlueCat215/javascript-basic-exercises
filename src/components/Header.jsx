import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { logout as logoutApi } from "../api/services/authService";
import { CartBadge } from "./cart/CartBadge";

export const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const handleLogout = async () => {
    try {
      await logoutApi(localStorage.getItem("refreshToken"));
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  return (
    <header className="border-b border-line bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-display font-bold text-lg text-ink">
          MiniShop
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/70">
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
        </nav>
        <div className="flex items-center gap-3">
          <CartBadge />
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="text-sm text-ink/70 hover:text-ink"
              >
                {user?.name?.firstname || user?.username}
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="text-sm text-gold hover:underline">
                  Quản trị
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="text-sm text-rust hover:underline"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm px-4 py-2">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
