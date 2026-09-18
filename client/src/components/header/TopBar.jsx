import { Link } from "react-router-dom";
import {
  SearchIcon,
  HeartIcon,
  UserIcon,
  CartIcon,
  PackageIcon,
  MenuIcon,
  ChevronRightIcon,
  LogOutIcon,
} from "../icons";

export const TopBar = ({
  search,
  setSearch,
  searchCategory,
  setSearchCategory,
  categories,
  onSearchSubmit,
  onOpenMobileMenu,
  isAuthenticated,
  favorites,
  cartCount,
  cartTotal,
  onLogout,
}) => {
  return (
    <header className="bg-green-light/90 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center gap-2 sm:gap-4 lg:gap-6">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden text-white p-1 shrink-0"
          aria-label="Mở menu"
        >
          <MenuIcon size={20} />
        </button>

        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <img
            src="/logo.svg"
            alt="Logo Mini Shop"
            className="h-10 sm:h-12 w-auto object-contain shrink-0"
          />
          <span className="hidden xs:block text-white font-display text-sm sm:text-lg font-bold leading-tight whitespace-nowrap">
            Mini Shop <br className="hidden sm:block" /> Hieu
          </span>
        </Link>

        <form
          onSubmit={onSearchSubmit}
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
          <button
            onClick={onOpenMobileMenu}
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

          {isAuthenticated && (
            <Link
              to="/account/orders"
              title="Đơn hàng của tôi"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white hover:bg-amber-100 flex items-center justify-center text-green transition-colors shrink-0"
            >
              <PackageIcon size={16} />
            </Link>
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
              <span className="font-bold text-sm">${cartTotal.toFixed(2)}</span>
            </div>
          </Link>

          {isAuthenticated && (
            <button
              onClick={onLogout}
              title="Đăng xuất"
              className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-red-500/10 hover:bg-red-500 items-center justify-center text-white/80 hover:text-white border border-white/10 hover:border-red-500/30 transition-all shrink-0"
            >
              <LogOutIcon size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
