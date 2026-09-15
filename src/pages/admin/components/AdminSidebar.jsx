import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PackageIcon,
  UsersIcon,
  TruckIcon,
  MenuIcon,
  CloseIcon,
} from "../../../components/icons";

const links = [
  { to: "/admin", end: true, label: "Tổng quan", Icon: DashboardIcon },
  { to: "/admin/products", label: "Sản phẩm", Icon: PackageIcon },
  { to: "/admin/orders", label: "Đơn hàng", Icon: TruckIcon },
  { to: "/admin/accounts", label: "Tài khoản", Icon: UsersIcon },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-green text-white" : "text-ink/70 hover:bg-paper"
  }`;

function SidebarLinks({ onNavigate }) {
  return (
    <>
      <p className="font-display font-bold text-ink px-4 mb-4">Admin</p>
      <nav className="space-y-1">
        {links.map(({ to, end, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={linkClass}
          >
            <Icon size={18} /> {label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

export const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-line flex items-center px-4 z-30">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Mở menu quản trị"
          className="text-ink p-1"
        >
          <MenuIcon size={20} />
        </button>
        <p className="font-display font-bold text-ink ml-3">Admin</p>
      </div>

      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-ink/30"
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 max-w-[80vw] bg-white p-4 space-y-1 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="font-display font-bold text-ink px-1">
                Admin
              </span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Đóng menu"
                className="text-ink/50 p-1"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {links.map(({ to, end, label, Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  <Icon size={18} /> {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <aside className="hidden lg:block w-56 border-r border-line bg-white p-4 space-y-1 shrink-0">
        <SidebarLinks />
      </aside>
    </>
  );
};
