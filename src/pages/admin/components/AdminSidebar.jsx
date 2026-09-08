import { NavLink } from "react-router-dom";
import {
  DashboardIcon,
  PackageIcon,
  UsersIcon,
} from "../../../components/icons";

const links = [
  { to: "/admin", end: true, label: "Tổng quan", Icon: DashboardIcon },
  { to: "/admin/products", label: "Sản phẩm", Icon: PackageIcon },
  { to: "/admin/accounts", label: "Tài khoản", Icon: UsersIcon },
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
    isActive ? "bg-green text-white" : "text-ink/70 hover:bg-paper"
  }`;

export const AdminSidebar = () => (
  <aside className="w-56 border-r border-line bg-white p-4 space-y-1 shrink-0">
    <p className="font-display font-bold text-ink px-4 mb-4">Admin</p>
    {links.map(({ to, end, label, Icon }) => (
      <NavLink key={to} to={to} end={end} className={linkClass}>
        <Icon size={18} /> {label}
      </NavLink>
    ))}
  </aside>
);
