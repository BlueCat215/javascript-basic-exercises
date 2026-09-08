import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="bg-green text-white mt-auto">
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <span className="font-display text-xl font-bold text-gold">
          MiniShop
        </span>
        <p className="text-white/60 text-sm mt-3">
          Website thương mại điện tử mini — bài tập tổng hợp React.
        </p>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
          Mua sắm
        </p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            <Link to="/products" className="hover:text-white">
              Sản phẩm
            </Link>
          </li>
          <li>
            <Link to="/cart" className="hover:text-white">
              Giỏ hàng
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
          Tài khoản
        </p>
        <ul className="space-y-2 text-sm text-white/70">
          <li>
            <Link to="/account" className="hover:text-white">
              Tài khoản của tôi
            </Link>
          </li>
          <li>
            <Link to="/account/orders" className="hover:text-white">
              Đơn hàng
            </Link>
          </li>
          <li>
            <Link to="/account/favorites" className="hover:text-white">
              Yêu thích
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
          Liên hệ
        </p>
        <p className="text-sm text-white/70">support@minishop.example</p>
      </div>
    </div>
    <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
      © {new Date().getFullYear()} MiniShop
    </div>
  </footer>
);
