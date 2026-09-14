import {
  TruckIcon,
  ShieldIcon,
  ReturnIcon,
  SupportIcon,
} from "../../../components/icons";

const items = [
  { Icon: TruckIcon, text: "Miễn phí vận chuyển từ $199" },
  { Icon: ReturnIcon, text: "Đổi trả trong 30 ngày" },
  { Icon: ShieldIcon, text: "Thanh toán an toàn 100%" },
  { Icon: SupportIcon, text: "Hỗ trợ khách hàng 24/7" },
];

export const TrustBadgesBar = () => (
  <section className="mt-12 bg-green-light/90 text-white py-8 px-6 lg:px-8 ">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 font-semibold text-center md:text-left">
      {items.map(({ Icon, text }, i) => (
        <div
          key={i}
          className="flex items-center justify-center md:justify-start gap-3.5 group cursor-default"
        >
          <div>
            <Icon size={25} className="text-gold" />
          </div>

          <span className="text-sm font-semibold md:text-[15px] leading-snug text-white/80 group-hover:text-white transition-colors">
            {text}
          </span>
        </div>
      ))}
    </div>
  </section>
);
