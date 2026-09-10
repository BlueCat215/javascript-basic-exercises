import { Link } from "react-router-dom";
import { useCategories } from "../hooks/useHomeQueries";
import { getCategoryIcon, ChevronRightIcon } from "../../../components/icons";

export const HeroBanner = () => {
  const { data: categories = [] } = useCategories();

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="hidden lg:block lg:col-span-3 bg-white border border-line rounded-lg overflow-hidden h-fit">
          <div className="bg-paper text-green px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b border-line">
            Danh mục sản phẩm
          </div>
          <ul className="text-xs text-ink/70 divide-y divide-line font-medium">
            {categories.map((c) => {
              const Icon = getCategoryIcon(c);
              return (
                <li key={c}>
                  <Link
                    to={`/products?category=${encodeURIComponent(c)}`}
                    className="px-4 py-2.5 flex items-center justify-between hover:bg-paper hover:text-green transition group capitalize"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={14} /> {c}
                    </span>
                    <ChevronRightIcon
                      size={12}
                      className="text-ink/30 group-hover:text-green"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-9 relative bg-gradient-to-r from-paper via-white to-gold-light/30 rounded-xl overflow-hidden border border-line flex flex-col md:flex-row items-center justify-between p-8 md:p-12 min-h-[380px]">
          <div className="z-10 max-w-md space-y-4 text-left">
            <div className="inline-flex items-center gap-2 bg-green/10 px-3 py-1 rounded-full text-green text-xs font-semibold tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-green" /> MiniShop
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-ink leading-tight">
              Mua sắm tinh tế,
              <br />
              <span className="text-green">giá cả hợp lý</span>
            </h1>
            <p className="text-sm text-ink/60 leading-relaxed">
              Khám phá hàng ngàn sản phẩm chất lượng, cập nhật mỗi ngày.
            </p>
            <Link to="/products" className="btn-primary inline-block">
              Mua sắm ngay
            </Link>
          </div>
          <div className="mt-6 md:mt-0 w-64 h-72 rounded-2xl bg-white/60 border-4 border-white shadow-sm" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            <span className="w-6 h-1.5 rounded-full bg-green" />
            <span className="w-2 h-1.5 rounded-full bg-line" />
            <span className="w-2 h-1.5 rounded-full bg-line" />
          </div>
        </div>
      </div>
    </main>
  );
};
