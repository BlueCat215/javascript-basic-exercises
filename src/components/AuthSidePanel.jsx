import { HeartIcon, TruckIcon, ShieldIcon } from "./icons";

export const AuthSidePanel = ({ title, subtitle }) => (
  <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6">
    <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center text-gold font-display font-bold text-4xl">
      H
    </div>
    <div>
      <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
      <p className="text-sm text-ink/50 mt-2 max-w-xs mx-auto">{subtitle}</p>
    </div>
    <div className="space-y-3 text-left max-w-xs w-full">
      <div className="flex items-center gap-3 text-xs text-ink/60">
        <HeartIcon size={16} className="text-green shrink-0" /> Lưu sản phẩm yêu
        thích
      </div>
      <div className="flex items-center gap-3 text-xs text-ink/60">
        <TruckIcon size={16} className="text-green shrink-0" /> Theo dõi đơn
        hàng dễ dàng
      </div>
      <div className="flex items-center gap-3 text-xs text-ink/60">
        <ShieldIcon size={16} className="text-green shrink-0" /> Bảo mật thông
        tin tuyệt đối
      </div>
    </div>
  </div>
);
