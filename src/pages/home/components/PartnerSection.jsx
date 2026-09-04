const partners = ["Nike", "Adidas", "Samsung", "Apple", "Sony", "LG"]; // thay logo thật nếu có

export const PartnerSection = () => {
  return (
    <section className="bg-paper border-t border-line py-10">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-ink/40 mb-6">
          Đối tác của chúng tôi
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-60">
          {partners.map((name) => (
            <span
              key={name}
              className="font-display font-bold text-lg text-ink"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
