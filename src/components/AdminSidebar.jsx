import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `block px-4 py-2.5 rounded-tag text-sm font-medium ${isActive ? "bg-ink text-white" : "text-ink/70 hover:bg-paper"}`;

export const AdminSidebar = () => (
  <aside className="w-56 border-r border-line bg-white p-4 space-y-1 shrink-0">
    <p className="font-display font-bold text-ink px-4 mb-4">Admin</p>
    <NavLink to="/admin" end className={linkClass}>
      Tổng quan
    </NavLink>
    <NavLink to="/admin/products" className={linkClass}>
      Sản phẩm
    </NavLink>
    <NavLink to="/admin/accounts" className={linkClass}>
      Tài khoản
    </NavLink>
  </aside>
);
