export const HeroBanner = () => {
  return (
    <section className="bg-gradient-to-r from-ink to-ink/80 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <p className="font-mono text-xs uppercase tracking-widest text-gold">
            Khuyến mãi mùa hè
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold leading-tight">
            Giảm giá đến 50%
            <br />
            cho mọi đơn hàng
          </h1>
          <p className="text-white/70 max-w-md mx-auto md:mx-0">
            Khám phá hàng ngàn sản phẩm chất lượng với mức giá tốt nhất.
          </p>
          <a
            href="/products"
            className="inline-block bg-gold text-ink px-6 py-3 rounded-tag font-semibold mt-2"
          >
            Mua sắm ngay
          </a>
        </div>
        <div className="flex-1">
          <div className="aspect-video bg-white/10 rounded-tag" />
        </div>
      </div>
    </section>
  );
};
