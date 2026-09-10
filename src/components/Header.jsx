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
  PhoneIcon,
  TruckIcon,
  ReturnIcon,
  ShieldIcon,
  MenuIcon,
  ChevronRightIcon,
} from "./icons";

export const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const [search, setSearch] = useState("");
  const [showCollections, setShowCollections] = useState(false);

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
      {/* TopNotificationBar */}
      <aside className="bg-green text-amber-100 text-xs py-2 px-4 border-b border-gold/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-gold text-green px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest">
              Ưu đãi
            </span>
            <span>
              Giảm 10% với mã:{" "}
              <strong className="text-white tracking-widest">MINI10</strong>
            </span>
            <span className="hidden sm:inline text-gold-light">|</span>
            <span className="hidden sm:inline">
              Miễn phí vận chuyển toàn quốc
            </span>
          </div>
          <Link
            to="/products"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-3 py-1 rounded text-[11px] uppercase tracking-widest transition"
          >
            Mua ngay
          </Link>
        </div>
      </aside>

      {/* thanh thông tin, chỉ hiện desktop */}
      <div className="border-b border-line bg-paper text-xs text-ink/50 py-1.5 px-4 hidden lg:block">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <PhoneIcon size={13} className="text-green" /> Hotline 24/7:{" "}
            <strong className="text-ink font-semibold">1900 1234</strong>
          </span>
          <Link to="/account/orders" className="hover:text-green">
            Tra cứu đơn hàng
          </Link>
        </div>
      </div>

      {/* MainHeaderTier2 */}
      <header className="bg-white border-b border-line py-4 px-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center text-gold font-display font-bold text-xl border border-gold/40">
              M
            </div>
            <div>
              <span className="font-display text-2xl font-bold tracking-widest text-green block leading-none">
                MINISHOP
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-ink/40 font-semibold block mt-1">
                Mua sắm trực tuyến
              </span>
            </div>
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <div className="flex w-full border-2 border-green rounded-full overflow-hidden bg-white">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="flex-1 px-4 py-2 text-sm outline-none border-none text-ink placeholder-ink/40"
              />
              <button
                type="submit"
                className="bg-green hover:bg-green-light text-white px-6 flex items-center justify-center transition"
              >
                <SearchIcon size={16} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-5">
            <Link
              to="/account/favorites"
              className="relative text-ink/70 hover:text-green transition p-1"
              aria-label="Yêu thích"
            >
              <HeartIcon size={22} strokeWidth={1.5} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {favorites.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/account" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/60 group-hover:border-green group-hover:text-green transition">
                    <UserIcon size={16} />
                  </div>
                  <div className="hidden xl:block text-left text-xs leading-tight">
                    <span className="text-ink/40 text-[10px] uppercase font-semibold block">
                      Xin chào
                    </span>
                    <span className="font-bold text-ink group-hover:text-green">
                      {user?.name?.firstname || user?.username}
                    </span>
                  </div>
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-xs font-bold text-gold uppercase hover:underline"
                  >
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-xs text-rust hover:underline"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/60 group-hover:border-green group-hover:text-green transition">
                  <UserIcon size={16} />
                </div>
                <span className="hidden xl:inline text-xs font-bold text-ink group-hover:text-green">
                  Đăng nhập
                </span>
              </Link>
            )}

            <Link
              to="/cart"
              className="flex items-center gap-3 bg-green/5 hover:bg-green/10 px-3 py-2 rounded-full transition"
            >
              <div className="relative">
                <CartIcon size={18} className="text-green" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-green text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left text-xs leading-none">
                <span className="text-[10px] text-ink/40 block font-semibold">
                  GIỎ HÀNG
                </span>
                <span className="font-bold text-green text-xs mt-0.5 inline-block">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* NavigationBarTier3 */}
      <nav className="bg-green text-white border-t border-green-light/30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="relative">
            <button
              onClick={() => setShowCollections((v) => !v)}
              className="bg-gold hover:bg-gold-light text-green font-semibold text-xs px-6 py-3.5 flex items-center gap-3 tracking-wider uppercase transition"
            >
              <MenuIcon size={14} /> Danh mục
            </button>
            {showCollections && (
              <div className="absolute left-0 top-full bg-white border border-line rounded-lg shadow-lg w-64 py-2 z-50">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={`/products?category=${encodeURIComponent(c)}`}
                    onClick={() => setShowCollections(false)}
                    className="px-4 py-2.5 flex items-center justify-between text-sm text-ink hover:bg-paper hover:text-green transition capitalize"
                  >
                    {c}
                    <ChevronRightIcon size={14} className="text-ink/30" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
            <Link to="/" className="py-3.5 hover:text-gold transition">
              Trang chủ
            </Link>
            <Link to="/products" className="py-3.5 hover:text-gold transition">
              Sản phẩm
            </Link>
            <Link
              to="/account/orders"
              className="py-3.5 hover:text-gold transition"
            >
              Đơn hàng
            </Link>
          </div>

          <div className="hidden xl:flex items-center gap-6 text-[11px] tracking-wide text-white/80">
            <span className="flex items-center gap-1.5">
              <TruckIcon size={14} className="text-gold" /> FREE SHIP TỪ $199
            </span>
            <span className="flex items-center gap-1.5">
              <ReturnIcon size={14} className="text-gold" /> ĐỔI TRẢ 30 NGÀY
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldIcon size={14} className="text-gold" /> AN TOÀN 100%
            </span>
          </div>
        </div>
      </nav>
    </>
  );
};
