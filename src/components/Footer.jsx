import { Link } from "react-router-dom";
import { useCategories } from "../pages/home/hooks/useHomeQueries";
import {
  PhoneIcon,
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  TwitterIcon,
} from "./icons";

export const Footer = () => {
  const { data: categories = [] } = useCategories();

  return (
    <footer className="bg-white text-ink/70 pt-12 pb-6 border-t border-line text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-10 border-b border-line">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green flex items-center justify-center text-gold font-display font-bold text-xl">
              M
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-widest text-green block leading-none">
                MINISHOP
              </span>
              <span className="text-[8px] uppercase tracking-[0.25em] text-ink/40 font-semibold">
                Mua sắm trực tuyến
              </span>
            </div>
          </div>
          <p className="text-ink/50 leading-relaxed text-[11px]">
            Website thương mại điện tử mini — bài tập tổng hợp React, TanStack
            Query, Zustand.
          </p>
          <div className="text-[11px] space-y-1 text-ink/60">
            <div className="flex items-center gap-1.5">
              <PhoneIcon size={12} className="text-green" /> Hotline:{" "}
              <strong className="text-green">1900 1234</strong>
            </div>
            <div>
              Mail:{" "}
              <a className="text-green" href="mailto:support@minishop.example">
                support@minishop.example
              </a>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            {[FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-7 h-7 rounded-full bg-paper hover:bg-green hover:text-white flex items-center justify-center transition text-ink/50"
                >
                  <Icon size={14} />
                </a>
              ),
            )}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-ink uppercase text-[11px] tracking-wider mb-3">
            Danh mục
          </h4>
          <ul className="space-y-2 text-ink/50 text-[11px]">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/products?category=${encodeURIComponent(c)}`}
                  className="hover:text-green transition capitalize"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-ink uppercase text-[11px] tracking-wider mb-3">
            Tài khoản
          </h4>
          <ul className="space-y-2 text-ink/50 text-[11px]">
            <li>
              <Link to="/account" className="hover:text-green">
                Tài khoản của tôi
              </Link>
            </li>
            <li>
              <Link to="/account/orders" className="hover:text-green">
                Đơn hàng
              </Link>
            </li>
            <li>
              <Link to="/account/favorites" className="hover:text-green">
                Yêu thích
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-green">
                Giỏ hàng
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-ink uppercase text-[11px] tracking-wider mb-3">
            Hỗ trợ
          </h4>
          <ul className="space-y-2 text-ink/50 text-[11px]">
            <li>
              <a href="#" className="hover:text-green">
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-green">
                Chính sách vận chuyển
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-ink uppercase text-[11px] tracking-wider mb-3">
            Đăng ký nhận tin
          </h4>
          <p className="text-ink/50 text-[11px] mb-3">
            Nhận ưu đãi mới nhất qua email.
          </p>
          <div className="flex border border-line rounded-full overflow-hidden">
            <input
              placeholder="Email của bạn"
              className="flex-1 px-3 py-2 text-[11px] outline-none min-w-0"
            />
            <button className="bg-green text-white px-3 text-[11px] font-semibold shrink-0">
              Gửi
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-ink/40 pt-6">
        © {new Date().getFullYear()} MiniShop
      </p>
    </footer>
  );
};
