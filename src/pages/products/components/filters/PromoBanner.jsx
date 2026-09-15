export function PromoBanner({ onClick }) {
  return (
    <div className="bg-linear-to-b from-green to-black rounded-lg p-5 text-white">
      <div className="text-[10px] uppercase font-bold tracking-widest text-gold mb-1">
        Ưu đãi
      </div>
      <h5 className="text-lg font-display font-bold mb-2">Giảm giá đến 30%</h5>
      <p className="text-xs text-white/70 mb-4">Cho đơn hàng đầu tiên</p>
      <button
        onClick={onClick}
        className="block w-full text-center bg-gold hover:bg-gold-light text-green text-xs font-bold uppercase py-2.5 rounded transition"
      >
        Xem ngay
      </button>
    </div>
  );
}
