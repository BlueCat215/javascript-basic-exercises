import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PackageIcon,
  UsersIcon,
  TruckIcon,
  MailIcon,
  CloseIcon,
  ExternalLinkIcon,
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
  `flex items-center gap-3 px-4 py-2.5 text-sm border-l-2 transition-colors ${
    isActive
      ? "border-gold bg-paper text-ink font-medium"
      : "border-transparent text-ink/60 hover:bg-paper hover:text-ink"
  }`;

export const AdminSidebar = ({ isOpen = false, onClose }) => {
  const { data: messages = [] } = useAdminContactMessagesQuery();
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/30 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-surface shrink-0 flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:z-auto lg:w-56 lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-line shrink-0">
          <p className="font-display font-semibold text-ink text-sm">
            Quản trị
          </p>
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-ink/50 hover:text-ink"
            aria-label="Đóng menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className="flex-1 py-2">
          {links.map(({ to, end, label, Icon, badgeKey }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={linkClass}
              onClick={onClose}
            >
              <Icon size={17} />
              {label}
              {badgeKey === "unread" && unread > 0 && (
                <span className="ml-auto text-[10px] font-mono font-semibold bg-rust text-white rounded-sm w-5 h-4 flex items-center justify-center">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 text-sm text-ink/60 hover:text-ink hover:bg-paper transition-colors border-t border-line"
        >
          <ExternalLinkIcon size={17} /> Xem trang web
        </a>
      </aside>
    </>
  );
};
