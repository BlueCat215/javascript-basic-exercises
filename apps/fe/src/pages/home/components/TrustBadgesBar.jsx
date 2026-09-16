import {
  TruckIcon,
  ShieldIcon,
  ReturnIcon,
  SupportIcon,
} from "../../../components/icons";

const items = [
  { Icon: TruckIcon, text: "Miễn phí vận chuyển từ $199" },
  { Icon: ReturnIcon, text: "Đổi trả dễ dàng 30 ngày" },
  { Icon: ShieldIcon, text: "Thanh toán an toàn 100%" },
  { Icon: SupportIcon, text: "Hỗ trợ khách hàng 24/7" },
];

export const TrustBadgesBar = () => (
  <section className="bg-green-light/90 mt-16 border-y  py-2 px-6">
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 ">
      {items.map(({ Icon, text }, i) => (
        <div
          key={i}
          className="flex flex-col items-center text-center gap-3 md:px-4"
        >
          <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-ink">
            <Icon size={20} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            {text}
          </span>
        </div>
      ))}
    </div>
  </section>
);
