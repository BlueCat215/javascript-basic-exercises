import { Link } from "react-router-dom";
import { Breadcrumb } from "../../components/Breadcrumb";
import { usePublicStats } from "../home/hooks/useHomeQueries";
import {
  ShieldIcon,
  TruckIcon,
  GemIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "../../components/icons";

const PILLARS = [
  {
    Icon: ShieldIcon,
    title: "Cam kết chính hãng",
    desc: "Mọi sản phẩm phân phối bởi MiniShop đều trải qua quy trình kiểm định chất lượng nghiêm ngặt, nguồn gốc rõ ràng, giúp bạn hoàn toàn yên tâm khi chọn mua.",
  },
  {
    Icon: TruckIcon,
    title: "Giao hàng hỏa tốc",
    desc: "Đơn hàng được tiếp nhận và xử lý tự động trong vài phút. Trung tâm kho vận tối ưu giúp sản phẩm tới tay bạn chỉ từ 1 - 3 ngày làm việc.",
  },
  {
    Icon: GemIcon,
    title: "Giá cả cạnh tranh",
    desc: "Mức giá niêm yết minh bạch cùng hàng ngàn chương trình ưu đãi, voucher độc quyền theo tháng dành riêng cho khách hàng thân thiết.",
  },
  {
    Icon: SparklesIcon,
    title: "Hỗ trợ tận tâm 24/7",
    desc: "Đội ngũ tư vấn viên luôn sẵn sàng giải đáp thắc mắc, hỗ trợ đổi trả linh hoạt và đồng hành cùng bạn trong suốt quá trình sử dụng sản phẩm.",
  },
];

const MILESTONES_LEFT = [
  {
    date: "Năm 2021",
    text: "Thành lập thương hiệu MiniShop và ra mắt nền tảng mua sắm trực tuyến đầu tiên.",
  },
  {
    date: "Năm 2022",
    text: "Mở rộng hệ thống kho vận tại Hà Nội & TP.HCM, vượt mốc 50.000 đơn hàng thành công.",
  },
  {
    date: "Năm 2023",
    text: "Chào đón thành viên thứ 100.000 và hợp tác cùng 30+ thương hiệu uy tín trong nước.",
  },
];

const MILESTONES_RIGHT = [
  {
    date: "Năm 2024",
    text: "Trở thành đối tác phân phối chính thức của nhiều thương hiệu quốc tế cao cấp.",
  },
  {
    date: "Năm 2025",
    text: "Chuẩn hóa quy trình giao hàng trong 24h và nâng cấp toàn bộ trải nghiệm người dùng.",
  },
  {
    date: "Năm 2026",
    text: "Khẳng định vị thế nền tảng bán lẻ mua sắm & lối sống được yêu thích nhất toàn quốc.",
  },
];

const TEAM = [
  {
    name: "Nguyễn Văn A",
    role: "Chủ tịch Hội đồng",
    image: "/bannerAbout/a.svg",
  },
  { name: "Trần Thị B", role: "Phó Chủ tịch", image: "/bannerAbout/b.svg" },
  {
    name: "Lê Hoàng C",
    role: "Tổng Giám đốc (CEO)",
    image: "/bannerAbout/c.svg",
  },
  {
    name: "Phạm Minh D",
    role: "Giám đốc Vận hành",
    image: "/bannerAbout/d.svg",
  },
  {
    name: "Phan Anh E",
    role: "Giám đốc Chiến lược",
    image: "/bannerAbout/e.svg",
  },
];

function ImagePlaceholder({
  src,
  label,
  className = "",
  imgClassName = "object-cover",
}) {
  return (
    <div
      className={`relative overflow-hidden bg-neutral-100 border border-line text-ink/40 ${className}`}
    >
      <img
        src={src}
        alt={label}
        className={`absolute inset-0 w-full h-full ${imgClassName}`}
      />
    </div>
  );
}

export default function AboutPage() {
  const { data: stats } = usePublicStats();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <Breadcrumb items={[{ label: "Giới thiệu" }]} />

      {/* HERO SECTION */}
      <section className="bg-white rounded border border-line/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="p-8 sm:p-10 lg:p-14 flex flex-col justify-center order-2 lg:order-1">
            <p className="text-xs font-bold uppercase tracking-widest text-green mb-3">
              Thương hiệu bán lẻ &amp; lối sống hàng đầu
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-ink leading-tight mb-5 tracking-tight">
              Định hình phong cách,
              <br />
              <span className="text-green">
                nâng tầm không gian sống của bạn
              </span>
            </h1>
            <p className="text-base sm:text-lg text-ink/80 leading-relaxed max-w-md">
              MiniShop là điểm đến tin cậy cho hàng triệu khách hàng Việt Nam.
              Chúng tôi mang đến giải pháp mua sắm hiện đại với danh mục sản
              phẩm chọn lọc, chất lượng cao và dịch vụ tận tâm.
            </p>
          </div>

          <ImagePlaceholder
            src="/bannerAbout/dautrang.svg"
            label="Banner MiniShop"
            className="order-1 lg:order-2 min-h-56 lg:min-h-full"
            imgClassName="object-cover"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-line/80 border-t border-line/80">
          <div className="p-6 sm:p-8 flex flex-col justify-center bg-white">
            <h3 className="text-lg font-bold text-ink leading-snug">
              Sứ mệnh trọn vẹn mang đến{" "}
              <span className="text-green font-extrabold uppercase tracking-wider text-sm block mt-1">
                Giá trị thực cho người dùng
              </span>{" "}
              trên khắp mọi miền đất nước.
            </h3>
          </div>
          <div className="p-6 sm:p-8 bg-white">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-ink mb-2">
              {stats?.productCount ?? "1,200+"}
            </div>
            <p className="text-sm font-semibold text-ink/70 uppercase tracking-wider">
              Sản phẩm chính hãng
            </p>
          </div>
          <div className="p-6 sm:p-8 bg-white">
            <div className="text-4xl sm:text-5xl font-display font-extrabold text-ink mb-2">
              {stats?.categoryCount ?? "24+"}
            </div>
            <p className="text-sm font-semibold text-ink/70 uppercase tracking-wider">
              Danh mục đa dạng
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded border border-line/80 shadow-sm overflow-hidden flex flex-col lg:flex-row">
        <div className="relative lg:w-2/5 min-h-64 lg:min-h-auto">
          <ImagePlaceholder
            src="/bannerAbout/team.svg"
            label="Về MiniShop"
            className="w-full h-full min-h-62"
            imgClassName="object-cover"
          />

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 lg:left-6 lg:translate-x-0 lg:bottom-6 bg-white rounded shadow-md border border-line/80 px-4 py-3 flex items-center gap-3 w-max max-w-[calc(100%-2rem)]">
            <div className="w-9 h-9 rounded-full bg-green/10 flex items-center justify-center text-green shrink-0">
              <ShieldIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-ink leading-tight">
                MiniShop Official
              </p>
              <p className="text-[11px] text-ink/50 leading-tight">
                Thương hiệu đã xác thực
              </p>
            </div>
          </div>
        </div>

        <div className="lg:w-3/5 p-8 sm:p-10 lg:p-12 pt-12 lg:pt-10 flex flex-col justify-center">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wide mb-5">
            Câu chuyện thương hiệu
          </h2>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-4">
            Khởi đầu từ niềm đam mê mang lại trải nghiệm mua sắm chuẩn mực,
            MiniShop được xây dựng với mục tiêu giúp khách hàng tiếp cận những
            sản phẩm cao cấp, thiết kế tinh tế mà không phải bận tâm về chất
            lượng hay nguồn gốc.
          </p>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-8">
            Chúng tôi tin rằng mua sắm trực tuyến không chỉ đơn thuần là giao
            dịch, mà là hành trình tận hưởng sự tiện lợi, an tâm và hài lòng
            trọn vẹn từ lúc lựa chọn đến khi cầm trên tay sản phẩm ưng ý.
          </p>
          <Link
            to="/products"
            className="btn-primary self-start rounded px-8 py-3 uppercase text-sm tracking-wider font-bold"
          >
            Khám phá cửa hàng
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

      <section className="bg-white rounded border border-line/80 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10 lg:p-14">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wide mb-5 pb-4 border-b border-line/80">
            Sứ mệnh &amp; Tầm nhìn
          </h2>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed mb-4 max-w-4xl">
            Sứ mệnh của MiniShop là nâng tầm chất lượng cuộc sống cho mỗi gia
            đình bằng việc mang đến các giải pháp tiêu dùng thông minh, an toàn
            và dẫn đầu xu hướng.
          </p>
          <p className="text-sm sm:text-base text-ink/80 leading-relaxed max-w-4xl">
            Chúng tôi nỗ lực trở thành hệ sinh thái bán lẻ trực tuyến đáng tin
            cậy nhất, nơi mua sắm luôn gắn liền với sự minh bạch, tốc độ và tinh
            thần phục vụ vượt kỳ vọng.
          </p>
        </div>

        <ImagePlaceholder
          src="/bannerAbout/workspace.svg"
          label="Trung tâm điều hành MiniShop"
          className="h-56 sm:h-72 lg:h-96 border-x-0 border-b-0"
          imgClassName="object-cover"
        />
      </section>

      <section className="bg-white rounded border border-line/80 shadow-sm p-8 sm:p-10 lg:p-14">
        <h2 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wide mb-8 pb-4 border-b border-line/80">
          Cột mốc phát triển
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
          {[...MILESTONES_LEFT, ...MILESTONES_RIGHT].map((m, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="shrink-0 text-xs font-bold uppercase tracking-wider text-green bg-green/10 rounded px-2.5 py-1 h-fit">
                {m.date}
              </span>
              <p className="text-sm text-ink/80 leading-relaxed">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded border border-line/80 shadow-sm p-8 sm:p-10 lg:p-14">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-line/80">
          <h2 className="text-xl sm:text-2xl font-display font-bold text-ink uppercase tracking-wide">
            Đội ngũ lãnh đạo
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="text-center flex flex-col items-center"
            >
              <ImagePlaceholder
                src={member.image}
                label={`Ảnh ${member.name}`}
                className="w-full aspect-square rounded-md mb-3 bg-neutral-50 p-2"
                imgClassName="object-contain"
              />

              <p className="text-sm font-bold text-ink">{member.name}</p>
              <p className="text-xs text-ink/50 uppercase tracking-wider mt-0.5">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          "100% Sản phẩm chính hãng",
          "Đổi trả miễn phí trong 30 ngày",
          "Tư vấn & Hỗ trợ CSKH 24/7",
        ].map((text) => (
          <div
            key={text}
            className="bg-white rounded border border-line/80 p-4 flex items-center gap-3 shadow-sm"
          >
            <CheckCircleIcon size={20} className="text-green shrink-0" />
            <span className="text-sm font-semibold text-ink">{text}</span>
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
