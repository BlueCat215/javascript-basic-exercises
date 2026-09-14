import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { logout as logoutApi } from "../api/services/authService";
import { useActiveCart } from "../pages/cart/hooks/useCartQueries";
import { useFavoritesQuery } from "../pages/account/hooks/useFavoriteQueries";
import { useCategories } from "../pages/home/hooks/useHomeQueries";
import {
  SearchIcon,
  HeartIcon,
  UserIcon,
  CartIcon,
  MenuIcon,
  ChevronRightIcon,
} from "./icons";
import { TopPromoBanner } from "./TopPormoBanner";

export const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showCollections, setShowCollections] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const { data: cart } = useActiveCart({ enabled: isAuthenticated });
  const { data: favorites = [] } = useFavoritesQuery();
  const { data: categories = [] } = useCategories();

  const cartCount =
    cart?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
  const cartTotal =
    cart?.products?.reduce(
      (sum, p) => sum + (p.product?.price || 0) * p.quantity,
      0,
    ) || 0;

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
    <>
      <TopPromoBanner />
      {/* Header chính */}
      <header className="bg-green-light/90 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green font-bold text-lg">
              M
            </div>
            <span className="text-white font-display text-lg font-bold leading-tight">
              Mini Shop
              <br />
              Hieu
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-xl hidden md:flex"
          >
            <div className="flex w-full bg-white rounded-full overflow-hidden">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="flex-1 px-4 py-2 text-sm outline-none text-ink"
              />
              <button
                type="submit"
                className="px-4 text-ink/50 hover:text-green transition"
              >
                <SearchIcon size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-4 ml-auto">
            <Link
              to="/account/favorites"
              className="relative w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
            >
              <HeartIcon size={16} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-green text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <Link
                to="/account"
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
              >
                <UserIcon size={16} />
              </Link>
            ) : (
              <div className="hidden lg:flex flex-col text-left text-white">
                <span className="text-[10px] uppercase tracking-wider text-white">
                  Chào Mừng
                </span>
                <Link to="/login" className="text-xs font-bold hover:underline">
                  Đăng nhập / Đăng ký
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-2.5 pl-4 border-l border-white/20"
            >
              <div className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center text-green">
                <CartIcon size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-white text-xs leading-tight">
                <span className="block text-[10px] uppercase text-white/60">
                  Cart
                </span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </Link>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-white/70 hover:text-white hover:underline"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Nav bar */}
      <nav className="bg-green-light/90">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowCollections((v) => !v)}
              className="bg-green text-white text-xs font-bold px-5 py-3.5 flex items-center gap-2.5 uppercase tracking-wide"
            >
              <MenuIcon size={14} /> Danh mục
            </button>
            {showCollections && (
              <div className="absolute left-0 top-full bg-white border border-line rounded-b-lg shadow-lg w-64 py-2 z-50">
                <p className="px-4 py-1.5 text-sm font-bold text-rust uppercase">
                  Ưu đãi 40%
                </p>
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/products?category=${encodeURIComponent(c)}`}
                    onClick={() => setShowCollections(false)}
                    className="px-4 py-2.5 flex items-center justify-between font-bold text-sm text-ink hover:bg-paper hover:text-green transition capitalize"
                  >
                    {c}
                    <ChevronRightIcon size={14} className="text-ink/30" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-white/90 uppercase tracking-wide">
            <Link to="/" className="py-3.5 font-bold hover:text-white">
              Trang chủ
            </Link>
            <Link to="/products" className="py-3.5 font-bold hover:text-white">
              Sản phẩm
            </Link>
            <Link to="/about" className="py-3.5 font-bold hover:text-white">
              Giới thiệu
            </Link>
            <Link to="/contact" className="py-3.5 font-bold hover:text-white">
              Liên hệ
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="border border-white rounded-full px-4 py-1.5 text-[12px] text-white/80">
              Hotline 24/7 <strong className="text-white">1900 1234</strong>
            </div>
            <span className="text-white text-xs font-bold">USD ▾</span>
            <span className="text-white text-xs font-bold">Eng ▾</span>
          </div>
        </div>
      </nav>
    </>
  );
};
