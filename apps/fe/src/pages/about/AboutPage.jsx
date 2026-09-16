import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";
import { usePublicStats } from "../home/hooks/useHomeQueries";
import {
  ShieldIcon,
  TruckIcon,
  GemIcon,
  SparklesIcon,
} from "../../components/icons";

const PILLARS = [
  {
    Icon: ShieldIcon,
    title: "Sản phẩm minh bạch",
    desc: "Mỗi sản phẩm trên MiniShop đều hiển thị đầy đủ danh mục, mức giá và mô tả chi tiết ngay từ trang danh sách, giúp bạn so sánh và ra quyết định mà không cần đoán mò hay lo bị thổi phồng thông tin.",
  },
  {
    Icon: TruckIcon,
    title: "Giao hàng nhanh chóng",
    desc: "Đơn hàng được xử lý gần như ngay khi đặt và bàn giao cho đơn vị vận chuyển sớm nhất có thể. Bạn có thể theo dõi từng chặng hành trình của đơn hàng ngay trong tài khoản cá nhân, không cần chờ đợi trong mơ hồ.",
  },
  {
    Icon: GemIcon,
    title: "Giá cả hợp lý",
    desc: "Mức giá được niêm yết rõ ràng và cạnh tranh, cùng các mã giảm giá theo mùa và ưu đãi dành riêng cho khách hàng thân thiết, để giá trị bạn nhận được luôn xứng đáng với số tiền bỏ ra.",
  },
  {
    Icon: SparklesIcon,
    title: "Trải nghiệm liền mạch",
    desc: "Từ lúc tìm kiếm sản phẩm, thêm vào giỏ hàng đến khi thanh toán, mọi thao tác đều được tối ưu để diễn ra trong vài cú nhấp chuột, kể cả khi bạn đang dùng điện thoại di động.",
  },
];

export default function AboutPage() {
  const { data: stats } = usePublicStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <Breadcrumb items={[{ label: "Giới thiệu" }]} />

      <section className="bg-white rounded border border-line/80 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10 lg:p-14 border-b border-line/80 bg-neutral-50/30">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink leading-tight mb-5 tracking-tight">
            Mua sắm đơn giản,
            <br />
            <span className="text-green">
              trải nghiệm mượt mà từ đầu đến cuối
            </span>
          </h1>
          <p className="text-base sm:text-lg text-ink/80 leading-relaxed max-w-3xl">
            MiniShop là một cửa hàng trực tuyến được xây dựng để chứng minh rằng
            mua sắm online không cần phức tạp: tìm sản phẩm nhanh, thông tin rõ
            ràng, đặt hàng chỉ trong vài bước, và bạn luôn biết đơn hàng của
            mình đang ở đâu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line/80">
          <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
            <h3 className="text-lg font-bold text-ink leading-snug">
              Mục tiêu của chúng tôi là mang lại{" "}
              <span className="text-green font-extrabold uppercase tracking-wider text-sm block mt-1">
                Trải nghiệm mượt mà
              </span>{" "}
              cho mọi người dùng, trên mọi thiết bị.
            </h3>
          </div>
          <div className="p-6 sm:p-8 bg-white">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-ink mb-2">
              {stats?.productCount ?? "—"}
            </div>
            <p className="text-sm font-semibold text-ink/70 uppercase tracking-wider">
              Sản phẩm kinh doanh
            </p>
          </div>
          <div className="p-6 sm:p-8 bg-white">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-ink mb-2">
              {stats?.categoryCount ?? "—"}
            </div>
            <p className="text-sm font-semibold text-ink/70 uppercase tracking-wider">
              Danh mục sắp xếp
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border border-line/80 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-2/5 bg-ink p-10 flex flex-col items-center justify-center text-white min-h-62">
          <div className="w-20 h-20 bg-white/10 border border-white/20 rounded flex items-center justify-center text-white font-display font-bold text-4xl mb-4">
            M
          </div>
          <p className="text-sm font-bold tracking-widest uppercase">
            MiniShop
          </p>
        </div>
        <div className="lg:w-3/5 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wide mb-5">
            Về dự án này
          </h2>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-4">
            MiniShop là một website thương mại điện tử được xây dựng nhằm áp
            dụng và luyện tập các kiến thức thực tế về ReactJS, TanStack Query,
            Zustand và React Hook Form trong một sản phẩm gần với ứng dụng thật.
          </p>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-8">
            Toàn bộ sản phẩm hiển thị trên trang đến từ nguồn dữ liệu mẫu phục
            vụ mục đích minh họa, cho phép trải nghiệm đầy đủ các luồng thao tác
            của một cửa hàng thực sự: duyệt sản phẩm, lọc theo danh mục, thêm
            vào giỏ hàng và theo dõi trạng thái đơn hàng, mà không cần lo về
            giao dịch thật.
          </p>
          <Link
            to="/products"
            className="btn-primary self-start rounded px-8 py-3 uppercase text-sm tracking-wider font-bold"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PILLARS.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="bg-white rounded border border-line/80 p-6 shadow-sm hover:border-ink/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-ink leading-snug">
                {title}
              </h3>
              <div className="w-10 h-10 rounded-sm bg-neutral-100 flex items-center justify-center text-ink shrink-0 border border-line/60">
                <Icon size={18} />
              </div>
            </div>
            <p className="text-sm text-ink/70 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-green rounded p-5 sm:p-6 text-white text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-sm sm:text-base shadow-sm">
        <span>
          Miễn phí vận chuyển cho mọi đơn hàng từ{" "}
          <strong className="font-bold text-lg">$199</strong> trở lên, áp dụng
          tự động khi thanh toán.
        </span>
        <Link
          to="/products"
          className="underline font-bold hover:text-white/80 shrink-0 uppercase tracking-wider text-sm mt-1 sm:mt-0"
        >
          Mua sắm ngay
        </Link>
      </section>
    </div>
  );
}
