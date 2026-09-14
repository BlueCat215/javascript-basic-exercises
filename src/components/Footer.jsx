import { Link } from "react-router-dom";
import { useCategories } from "../pages/home/hooks/useHomeQueries";
import { FacebookIcon, InstagramIcon, YoutubeIcon, TwitterIcon } from "./icons";

export const Footer = () => {
  const { data: categories = [] } = useCategories();

  return (
    <footer className="bg-white text-[#1a1a1a] pt-14 pb-4 border-t border-gray-100 text-[13px] mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8 pb-12 border-b border-gray-100">
          <div className="lg:col-span-3">
            <h4 className="font-bold text-[#1a1a1a] text-[14px] mb-4">
              Phân Loại
            </h4>
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
                      Infant
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-[#00a79d]">
                      Baby Fashion
                    </Link>
                  </li>
                  <li>
                    <Link to="/products" className="hover:text-[#00a79d]">
                      Toys & Study
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-[#1a1a1a] text-[14px] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <Link to="/about" className="hover:text-[#00a79d]">
                  About Swatbabymall
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#00a79d]">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/career" className="hover:text-[#00a79d]">
                  Career
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#00a79d]">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-[#00a79d]">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/locations" className="hover:text-[#00a79d]">
                  Store Locations
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-[#1a1a1a] text-[14px] mb-4">
              Help Center
            </h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Customer Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Track Order
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/account" className="hover:text-[#00a79d]">
                  My Account
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="font-bold text-[#1a1a1a] text-[14px] mb-4">
              Partner
            </h4>
            <ul className="space-y-2.5 text-gray-500">
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Become Seller
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Affiliate
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Advertise
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#00a79d]">
                  Partnership
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-4 lg:pl-6">
            <h4 className="font-bold text-[#1a1a1a] text-[15px]">
              Subscribe & Get{" "}
              <span className="text-red-500 font-semibold">10% OFF</span>
            </h4>

            <div className="flex rounded-md overflow-hidden bg-[#f0f2f5] p-0.5 border border-transparent focus-within:border-gray-300 max-w-md">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-3 py-2.5 text-[13px] bg-transparent outline-none min-w-0 text-gray-700 placeholder-gray-400"
              />
              <button className="bg-[#00a79d] hover:bg-[#008c84] text-white px-5 text-[11px] font-bold tracking-wider uppercase rounded-sm transition shrink-0">
                SUBSCRIBE
              </button>
            </div>

            <p className="text-[12px] text-gray-400">
              By subscribing, you accept the{" "}
              <a href="#" className="underline hover:text-gray-600">
                Privacy Policy
              </a>
            </p>

            <div className="text-[13px] text-gray-600 space-y-1.5 pt-2">
              <p>
                Hotline 24/7:{" "}
                <span className="text-[#00a79d] font-semibold">
                  (+325) 3686 25 16
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Work Hours:</span>{" "}
                Monday-Saturday: 9.00am - 5.00pm
              </p>
              <p>
                <span className="font-medium text-gray-700">Mail:</span>{" "}
                contact@swatbabymall.com
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              {[TwitterIcon, FacebookIcon, InstagramIcon, YoutubeIcon].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-[#f4f6f8] hover:bg-[#00a79d] hover:text-white flex items-center justify-center transition text-gray-700"
                  >
                    <Icon size={13} />
                  </a>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-5 border-b border-gray-100 text-gray-500 text-[12px]">
          <div className="flex gap-2">
            <select className="border border-gray-200 rounded px-3 py-1 bg-white outline-none cursor-pointer hover:border-gray-300">
              <option>USD</option>
            </select>
            <select className="border border-gray-200 rounded px-3 py-1 bg-white outline-none cursor-pointer hover:border-gray-300">
              <option>Eng</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-[14px] font-sans font-bold tracking-tight select-none opacity-80">
            <span className="text-[#003087] italic">PayPal</span>
            <span className="text-[#eb001b]">mastercard</span>
            <span className="text-[#00579f]">VISA</span>
            <span className="text-[#635bff] lowercase">stripe</span>
            <span className="text-[#ffb3c7] lowercase">klarna.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-[12px]">Download App</span>
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

        <div className="text-center text-gray-400 text-[12px] pt-4">
          © 2024 <span className="font-semibold text-gray-700">Shawonetc3</span>
          . All Rights Reserved
        </div>
      </div>
    </footer>
  );
};
