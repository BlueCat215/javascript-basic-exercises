import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";
import { usePublicStats } from "../home/hooks/useHomeQueries";
import { ShieldIcon, TruckIcon, GemIcon } from "../../components/icons";

const PILLARS = [
  {
    Icon: ShieldIcon,
    title: "Sản phẩm minh bạch",
    desc: "Mọi sản phẩm hiển thị đầy đủ thông tin danh mục, giá và mô tả rõ ràng, không gây hiểu nhầm cho người mua.",
  },
  {
    Icon: TruckIcon,
    title: "Giao hàng nhanh chóng",
    desc: "Đơn hàng được xử lý và giao đi sớm nhất có thể, kèm theo dõi trạng thái minh bạch trong tài khoản của bạn.",
  },
  {
    Icon: GemIcon,
    title: "Giá cả hợp lý",
    desc: "Mức giá cạnh tranh, thường xuyên có mã giảm giá và ưu đãi cho khách hàng thân thiết.",
  },
];

export default function AboutPage() {
  const { data: stats } = usePublicStats();

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <Breadcrumb items={[{ label: "Giới thiệu" }]} />
      <section className="bg-white rounded-xl border border-line p-6 lg:p-10">
        <div className="bg-paper rounded-xl p-8 lg:p-12 uppercase">
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-ink leading-tight mb-3">
            Mua sắm đơn giản, <br />
            <span className="text-green italic">trải nghiệm mượt mà</span>
          </h1>
          <p className="text-[15px] text-ink tracking-wide font-medium">
            MiniShop — Dự án website thương mại điện tử
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 px-2">
          <div className="lg:border-r border-line pr-4">
            <h3 className="text-xl font-bold uppercase text-ink leading-snug">
              Mục tiêu của chúng tôi là mang lại{" "}
              <span className="text-green font-extrabold">
                trải nghiệm mua sắm mượt mà
              </span>{" "}
              cho mọi người dùng
            </h3>
          </div>
          <div className="lg:border-r border-line pr-4">
            <div className="text-3xl font-display font-extrabold text-ink">
              {stats?.productCount ?? "—"}
            </div>
            <p className="text-[15px] font-semibold text-ink uppercase mt-1">
              Sản phẩm đang kinh doanh
            </p>
          </div>
          <div>
            <div className="text-3xl font-display font-extrabold text-ink">
              {stats?.categoryCount ?? "—"}
            </div>
            <p className="text-[15px] font-semibold text-ink uppercase mt-1">
              Danh mục sản phẩm
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-green to-green-light rounded-xl min-h-75 flex items-center justify-center p-8">
          <div className="text-center text-white space-y-3">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/10 border-2 border-gold/30 flex items-center justify-center text-gold font-display font-bold text-3xl">
              M
            </div>
            <p className="text-sm font-semibold tracking-widest uppercase text-gold">
              MiniShop
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-line p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="text-xl lg:text-2xl font-display font-bold text-ink leading-snug mb-4">
            Về dự án này
          </h2>
          <p className="text-[15px] text-ink leading-relaxed mb-6">
            MiniShop là một website thương mại điện tử được xây dựng nhằm áp
            dụng các kiến thức về ReactJS, TanStack Query, Zustand, React Hook
            Form. Sản phẩm hiển thị trên trang đến từ nguồn dữ liệu mẫu phục vụ
            mục đích minh họa.
          </p>
          <Link to="/products" className="btn-primary self-start">
            Khám phá sản phẩm
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PILLARS.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded-xl border border-line p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-ink uppercase tracking-tight leading-snug">
                {title}
              </h3>
              <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center text-white shrink-0">
                <Icon size={18} />
              </div>
            </div>
            <p className="text-[15px] text-ink leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-linear-to-r from-green to-green-light rounded-xl p-4 text-white text-center flex items-center justify-center gap-2 text-xs md:text-sm font-medium">
        <span>
          Miễn phí vận chuyển cho đơn hàng từ{" "}
          <strong className="font-bold">$199</strong> trở lên
        </span>
        <Link
          to="/products"
          className="underline font-bold hover:text-gold-light ml-1"
        >
          Mua sắm ngay
        </Link>
      </section>
    </div>
  );
}
