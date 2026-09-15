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
  LogOutIcon,
  CloseIcon,
} from "./icons";
import { TopPromoBanner } from "./TopPormoBanner";

export const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showCollections, setShowCollections] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (searchCategory) params.set("category", searchCategory);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <>
      <TopPromoBanner />
      {/* Header chính */}
      <header className="bg-green-light/90 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center gap-2 sm:gap-4 lg:gap-6">
          <button
            onClick={() => setShowMobileMenu(true)}
            className="lg:hidden text-white p-1 shrink-0"
            aria-label="Mở menu"
          >
            <MenuIcon size={20} />
          </button>

          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center text-green font-bold text-base sm:text-lg shrink-0">
              M
            </div>
            <span className="hidden xs:block text-white font-display text-sm sm:text-lg font-bold leading-tight whitespace-nowrap">
              Mini Shop <br className="hidden sm:block" /> Hieu
            </span>
          </Link>

          <form
            onSubmit={handleSearch}
            className="flex-1 min-w-0 max-w-xl hidden lg:flex"
          >
            <div className="flex w-full bg-white rounded-full overflow-hidden">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="flex-1 min-w-0 px-4 py-2 text-sm outline-none text-ink"
              />
              <button
                type="submit"
                className="px-4 text-ink hover:text-green transition shrink-0"
              >
                <SearchIcon size={16} />
              </button>

              <div className="relative shrink-0 border-r border-line">
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="h-full appearance-none bg-transparent pl-4 pr-8 text-xs font-bold text-ink outline-none cursor-pointer capitalize max-w-36 truncate"
                >
                  <option value="">Tất cả danh mục</option>
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronRightIcon
                  size={12}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-ink pointer-events-none"
                />
              </div>
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 ml-auto shrink-0">
            {/* Ô tìm kiếm nhanh cho mobile/tablet: mở menu (đã có ô tìm kiếm) */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-amber-100 flex items-center justify-center text-green transition-colors shrink-0"
              aria-label="Tìm kiếm"
            >
              <SearchIcon size={16} />
            </button>

            <Link
              to="/account/favorites"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-amber-100 flex items-center justify-center text-green transition-colors shrink-0"
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
                className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-amber-100 flex items-center justify-center text-green transition-colors shrink-0"
              >
                <UserIcon size={16} />
              </Link>
            ) : (
              <div className="hidden lg:flex flex-col text-left text-white shrink-0">
                <span className="text-[10px] uppercase tracking-wider text-white/70">
                  Chào Mừng
                </span>
                <Link
                  to="/login"
                  className="text-xs font-bold hover:underline uppercase"
                >
                  Đăng nhập / Đăng ký
                </Link>
              </div>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-2 sm:gap-3 sm:pl-4 sm:border-l sm:border-white/20 hover:opacity-90 group transition shrink-0"
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white group-hover:bg-amber-100 flex items-center justify-center text-green transition-colors shrink-0">
                <CartIcon size={16} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-white text-xs leading-tight">
                <span className="block text-[10px] uppercase text-white/70 tracking-wider">
                  Giỏ hàng
                </span>
                <span className="font-bold text-sm">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </Link>

            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-500/10 hover:bg-red-500 items-center justify-center text-white/80 hover:text-white border border-white/10 hover:border-red-500/30 transition-all shrink-0"
              >
                <LogOutIcon size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85vw] max-w-xs sm:w-80 bg-white shadow-xl p-5 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-ink">Menu</span>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-ink/50"
                aria-label="Đóng menu"
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                handleSearch(e);
                setShowMobileMenu(false);
              }}
              className="flex border border-line rounded-full overflow-hidden"
            >
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="flex-1 min-w-0 px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="px-3 text-ink/50 shrink-0">
                <SearchIcon size={16} />
              </button>
            </form>

            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
                className="sm:hidden flex items-center gap-2 text-sm font-semibold text-red-500"
              >
                <LogOutIcon size={16} /> Đăng xuất
              </button>
            )}

            <nav className="flex flex-col gap-1 text-sm font-semibold text-ink">
              <Link
                to="/"
                onClick={() => setShowMobileMenu(false)}
                className="py-2.5 border-b border-line"
              >
                Trang chủ
              </Link>
              <Link
                to="/products"
                onClick={() => setShowMobileMenu(false)}
                className="py-2.5 border-b border-line"
              >
                Sản phẩm
              </Link>
              <Link
                to="/about"
                onClick={() => setShowMobileMenu(false)}
                className="py-2.5 border-b border-line"
              >
                Giới thiệu
              </Link>
              <Link
                to="/contact"
                onClick={() => setShowMobileMenu(false)}
                className="py-2.5 border-b border-line"
              >
                Liên hệ
              </Link>
            </nav>

            <div>
              <p className="text-xs font-bold text-ink/40 uppercase mb-2">
                Danh mục
              </p>
              <div className="flex flex-col gap-1">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/products?category=${encodeURIComponent(c)}`}
                    onClick={() => setShowMobileMenu(false)}
                    className="py-2 text-sm text-ink/70 capitalize hover:text-green"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-green-light/90 hidden lg:block">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowCollections((v) => !v)}
              className="bg-green-light/90 text-white rounded hover:bg-[#F1DC67] hover:text-green transition text-xs font-bold px-5 py-3.5 flex items-center gap-2.5 uppercase tracking-wide"
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

          <div className="flex items-center gap-5 xl:gap-7 text-xs font-semibold text-white/90 uppercase tracking-wide">
            <Link to="/" className="py-3.5 font-bold hover:text-[#F1DC67]">
              Trang chủ
            </Link>
            <Link
              to="/products"
              className="py-3.5 font-bold hover:text-[#F1DC67]"
            >
              Sản phẩm
            </Link>
            <Link to="/about" className="py-3.5 font-bold hover:text-[#F1DC67]">
              Giới thiệu
            </Link>
            <Link
              to="/contact"
              className="py-3.5 font-bold hover:text-[#F1DC67]"
            >
              Liên hệ
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-4">
            <div className="border border-white rounded-full px-4 py-1.5 text-[12px] text-white/80 whitespace-nowrap">
              Hotline 24/7 <strong className="text-white">1900 1234</strong>
            </div>
            <select className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer">
              <option value="VND" className="text-ink">
                VIE
              </option>
              <option value="USD" className="text-ink">
                ENG
              </option>
            </select>
            <span className="text-white">|</span>
            <select className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer">
              <option value="VND" className="text-ink">
                VND
              </option>
              <option value="USD" className="text-ink">
                USD
              </option>
            </select>
          </div>
        </div>
      </nav>
    </>
  );
};
