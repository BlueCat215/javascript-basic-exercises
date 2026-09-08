import { Link } from "react-router-dom";

export const HeroBanner = () => (
  <section className="bg-paper border-b border-line">
    <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 space-y-5 text-center md:text-left">
        <span className="inline-block bg-gold text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
          Ưu đãi mùa này
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight">
          Mua sắm tinh tế,
          <br />
          <span className="text-green">giá cả hợp lý</span>
        </h1>
        <p className="text-ink/60 max-w-md mx-auto md:mx-0">
          Khám phá hàng ngàn sản phẩm chất lượng, cập nhật mỗi ngày.
        </p>
        <Link to="/products" className="btn-primary inline-block">
          Mua sắm ngay
        </Link>
      </div>
      <div className="flex-1 w-full">
        <div className="aspect-video bg-green/5 border border-line rounded-lg" />
      </div>
    </div>
  </section>
);
