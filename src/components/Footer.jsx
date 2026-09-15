import { Link } from "react-router-dom";
import { useCategories } from "../pages/home/hooks/useHomeQueries";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from "./icons";

export const Footer = () => {
  const { data: categories = [] } = useCategories();

  return (
    <footer className="bg-white text-green pt-10 sm:pt-14 pb-4 border-t border-gray-100 text-[13px] mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-12 border-b border-gray-100">
          {/* Phân Loại */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-green text-[14px] mb-4">Phân Loại</h4>
            <ul className="space-y-2.5 text-gray-500">
              {categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/products?category=${encodeURIComponent(c)}`}
                    className="hover:text-[#00a79d] transition capitalize block"
                  >
                    {c}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <>
                  <li>
                    <Link to="/products" className="hover:text-[#00a79d]">
                      Trẻ sơ sinh
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-[#00a79d]">
                      Thời trang cho bé
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-[#00a79d]">
                      Đồ chơi & Học tập
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Công Ty */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-green text-[14px] mb-4">Công Ty</h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <Link to="/about" className="hover:text-[#00a79d]">
                  Về Swatbabymall
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00a79d]">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-[#00a79d]">
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#00a79d]">
                  Tin tức / Blog
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-[#00a79d]">
                  Sơ đồ trang
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-[#00a79d]">
                  Hệ thống cửa hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Trung Tâm Trợ Giúp */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-green text-[14px] mb-4">
              Trung Tâm Trợ Giúp
            </h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Chăm sóc khách hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Điều khoản & Điều kiện
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Theo dõi đơn hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Câu hỏi thường gặp (FAQs)
                </a>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#00a79d]">
                  Tài khoản của tôi
                </Link>
              </li>
            </ul>
          </div>

          {/* Đối Tác */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-green text-[14px] mb-4">Đối Tác</h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Trở thành người bán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Tiếp thị liên kết
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Quảng cáo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Hợp tác phát triển
                </a>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 space-y-4 lg:pl-6">
            <h4 className="font-bold text-green text-[15px]">
              Đăng Ký Nhận Tin & Nhận{" "}
              <span className="text-[#E84C3D] font-bold">GIẢM 10%</span>
            </h4>
            <div className="flex rounded-md overflow-hidden bg-[#f0f2f5] p-0.5 border border-transparent focus-within:border-gray-300 max-w-md">
              <input
                type="email"
                placeholder="Địa chỉ Email"
                className="flex-1 px-3 py-2.5 text-[13px] bg-transparent outline-none min-w-0 text-gray-700 placeholder-gray-400"
              />
              <button className="bg-green hover:bg-green-light/90 text-white px-3 sm:px-5 text-[11px] font-bold tracking-wider uppercase rounded-sm transition shrink-0">
                ĐĂNG KÝ
              </button>
            </div>
            <p className="text-[12px] text-gray-400">
              Bằng cách đăng ký, bạn đã chấp nhận{" "}
              <a href="#" className="underline hover:text-gray-600">
                Chính sách bảo mật
              </a>{" "}
              của chúng tôi
            </p>
            <div className="text-[13px] text-gray-600 space-y-1.5 pt-2">
              <p>
                Hotline 24/7:{" "}
                <span className="text-[#00a79d] font-semibold">1900 1234</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">
                  Thời gian làm việc:
                </span>{" "}
                Thứ Hai - Thứ Bảy: 9:00 - 17:00
              </p>
              <p>
                <span className="font-medium text-gray-700">Mail:</span>{" "}
                contact@swatbabymall.com
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 pt-2">
              {[TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#f4f6f8] hover:bg-[#00a79d] hover:text-white flex items-center justify-center transition text-gray-700 shrink-0"
                  >
                    <Icon size={13} />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Thanh Tiền tệ, Cổng Thanh toán & Tải App */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 py-5 border-b border-gray-100 text-gray-500 text-[12px]">
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded px-3 py-1 bg-white outline-none cursor-pointer hover:border-gray-300">
              <option>VND</option>
              <option>USD</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-1 bg-white outline-none cursor-pointer hover:border-gray-300">
              <option>Vie</option>
              <option>Eng</option>
            </select>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[14px] font-sans font-bold tracking-tight select-none opacity-80">
            <span className="text-[#003087] italic">PayPal</span>
            <span className="text-[#eb001b]">mastercard</span>
            <span className="text-[#00579f]">VISA</span>
            <span className="text-[#635bff] lowercase">stripe</span>
            <span className="text-[#ffb3c7] lowercase">klarna.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-gray-400 text-[12px]">Tải ứng dụng</span>
            <a
              href="#"
              className="bg-black hover:bg-gray-900 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition"
            >
              <span className="font-bold">App Store</span>
            </a>
            <a
              href="#"
              className="bg-black hover:bg-gray-900 text-white px-3 py-1.5 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition"
            >
              <span className="font-bold">Google Play</span>
            </a>
          </div>
        </div>

        {/* Bản quyền */}
        <div className="text-center text-gray-400 text-[12px] pt-4">
          © 2026 <span className="font-semibold text-gray-700">MiniShop</span> .
          Bảo lưu mọi quyền.
        </div>
      </div>
    </footer>
  );
};
