import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PackageIcon,
  UsersIcon,
  TruckIcon,
  MailIcon,
  CloseIcon,
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

export const AdminSidebar = ({ isOpen = false, onClose }) => {
  const { data: messages = [] } = useAdminContactMessagesQuery();
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <>
      {/* Overlay for mobile, closes the drawer on tap */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-white p-4 space-y-1 shrink-0
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:z-auto lg:w-56 lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 mb-4">
          <p className="font-display font-bold text-ink">Admin</p>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-ink/50 hover:text-ink"
            aria-label="Đóng menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>
        {links.map(({ to, end, label, Icon, badgeKey }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            onClick={onClose}
          >
            <Icon size={18} /> {label}
            {badgeKey === "unread" && unread > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-rust text-white rounded-full w-5 h-5 flex items-center justify-center">
                {unread}
              </span>
            )}
          </NavLink>
        ))}
      </aside>
    </>
  );
};
