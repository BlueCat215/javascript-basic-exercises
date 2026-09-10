import {
  TruckIcon,
  ShieldIcon,
  ReturnIcon,
  SupportIcon,
} from "../../../components/icons";

const items = [
  { Icon: TruckIcon, text: "Miễn phí vận chuyển đơn từ $199" },
  { Icon: ReturnIcon, text: "Đổi trả trong 30 ngày" },
  { Icon: ShieldIcon, text: "Thanh toán an toàn 100%" },
  { Icon: SupportIcon, text: "Hỗ trợ khách hàng 24/7" },
];

export const TrustBadgesBar = () => (
  <section className="mt-16 bg-green text-white py-5 px-4">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-center md:text-left">
      {items.map(({ Icon, text }, i) => (
        <div
          key={i}
          className="flex items-center justify-center md:justify-start gap-3"
        >
          <Icon size={20} className="text-gold" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  </section>
);
