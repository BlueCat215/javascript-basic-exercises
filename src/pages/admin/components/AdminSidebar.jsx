import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PackageIcon,
  UsersIcon,
  TruckIcon,
  MailIcon,
} from "../../../components/icons";
import { useAdminContactMessagesQuery } from "../hooks/useAdminContactQueries";

const links = [
  { to: "/admin", end: true, label: "Tổng quan", Icon: DashboardIcon },
  { to: "/admin/products", label: "Sản phẩm", Icon: PackageIcon },
  { to: "/admin/orders", label: "Đơn hàng", Icon: TruckIcon },
  {
    to: "/admin/contact-messages",
    label: "Tin nhắn liên hệ",
    Icon: MailIcon,
    badgeKey: "unread",
  },
  { to: "/admin/accounts", label: "Tài khoản", Icon: UsersIcon },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-green text-white" : "text-ink/70 hover:bg-paper"
  }`;

export const AdminSidebar = () => {
  const { data: messages = [] } = useAdminContactMessagesQuery();
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <aside className="w-56 border-r border-line bg-white p-4 space-y-1 shrink-0">
      <p className="font-display font-bold text-ink px-4 mb-4">Admin</p>
      {links.map(({ to, end, label, Icon, badgeKey }) => (
        <NavLink key={to} to={to} end={end} className={linkClass}>
          <Icon size={18} /> {label}
          {badgeKey === "unread" && unread > 0 && (
            <span className="ml-auto text-[10px] font-bold bg-rust text-white rounded-full w-5 h-5 flex items-center justify-center">
              {unread}
            </span>
          )}
        </NavLink>
      ))}
    </aside>
  );
};
