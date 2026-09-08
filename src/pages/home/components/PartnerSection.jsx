const partners = [
  { name: "Nike", url: "https://nike.com" },
  { name: "Adidas", url: "https://adidas.com" },
  { name: "Samsung", url: "https://samsung.com" },
  { name: "Apple", url: "https://apple.com" },
  { name: "Sony", url: "https://sony.com" },
  { name: "LG", url: "https://lg.com" },
];

export const PartnerSection = () => (
  <section className="bg-green py-10">
    <div className="max-w-6xl mx-auto px-6">
      <p className="text-center font-mono text-xs uppercase tracking-widest text-gold mb-6">
        Đối tác của chúng tôi
      </p>
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-lg text-white/70 hover:text-white transition-colors duration-200"
          >
            {partner.name}
          </a>
        ))}
      </div>
    </div>
  </section>
);
