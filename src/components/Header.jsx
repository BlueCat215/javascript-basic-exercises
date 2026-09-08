import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { logout as logoutApi } from "../api/services/authService";
import { CartBadge } from "./CartBadge";
import { SearchIcon, LogOutIcon } from "../components/icons";

export const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    try {
      await logoutApi(localStorage.getItem("refreshToken"));
    } finally {
      clearAuth();
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(search)}`);
  };

  return (
    <header className="bg-white border-b border-line sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="w-10 h-10 rounded-full bg-green flex items-center justify-center text-gold font-display font-bold text-xl">
            M
          </span>
          <span className="font-display text-xl font-bold text-ink hidden sm:block">
            MiniShop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink/70 shrink-0">
          <Link to="/" className="hover:text-green">
            Trang chủ
          </Link>
          <Link to="/products" className="hover:text-green">
            Sản phẩm
          </Link>
        </nav>

        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-md hidden md:flex border-2 border-green rounded-full overflow-hidden bg-white"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="flex-1 px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="px-4 bg-green text-white grid place-items-center"
          >
            <SearchIcon size={16} className="text-white" />
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="text-ink/60 hover:text-rust"
          aria-label="Đăng xuất"
        >
          <LogOutIcon size={18} />
        </button>

        <div className="flex items-center gap-3 ml-auto">
          <CartBadge />
          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                className="text-sm text-ink/70 hover:text-green hidden sm:block"
              >
                {user?.name?.firstname || user?.username}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-sm text-gold font-semibold hover:underline"
                >
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
            <Link to="/login" className="btn-primary text-sm">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
