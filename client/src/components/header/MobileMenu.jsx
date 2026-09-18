import { Link } from "react-router-dom";
import { SearchIcon, LogOutIcon, CloseIcon } from "../icons";

export const MobileMenu = ({
  open,
  onClose,
  search,
  setSearch,
  onSearchSubmit,
  isAuthenticated,
  onLogout,
  categories,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[85vw] max-w-xs sm:w-80 bg-white shadow-xl p-5 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <span className="font-display font-bold text-ink">Menu</span>
          <button
            onClick={onClose}
            className="text-ink/50"
            aria-label="Đóng menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            onSearchSubmit(e);
            onClose();
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
              onLogout();
              onClose();
            }}
            className="sm:hidden flex items-center gap-2 text-sm font-semibold text-red-500"
          >
            <LogOutIcon size={16} /> Đăng xuất
          </button>
        )}

        <nav className="flex flex-col gap-1 text-sm font-semibold text-ink">
          <Link
            to="/"
            onClick={onClose}
            className="py-2.5 border-b border-line"
          >
            Trang chủ
          </Link>
          <Link
            to="/products"
            onClick={onClose}
            className="py-2.5 border-b border-line"
          >
            Sản phẩm
          </Link>
          <Link
            to="/about"
            onClick={onClose}
            className="py-2.5 border-b border-line"
          >
            Giới thiệu
          </Link>
          <Link
            to="/contact"
            onClick={onClose}
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
                onClick={onClose}
                className="py-2 text-sm text-ink/70 capitalize hover:text-green"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
