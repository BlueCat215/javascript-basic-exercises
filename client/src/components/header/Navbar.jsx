import { useState } from "react";
import { Link } from "react-router-dom";
import { MenuIcon, ChevronRightIcon } from "../icons";

export const Navbar = ({ categories }) => {
  const [showCollections, setShowCollections] = useState(false);

  return (
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
          <Link to="/contact" className="py-3.5 font-bold hover:text-[#F1DC67]">
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
  );
};
