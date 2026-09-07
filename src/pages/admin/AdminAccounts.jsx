import { useState, useMemo } from "react";
import {
  useAdminAccountsQuery,
  useToggleLockAccount,
  useDeleteAccount,
} from "./hooks/useAdminAccountQueries";

export default function AdminAccounts() {
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: accounts = [], isLoading } = useAdminAccountsQuery();
  const { mutate: toggleLock } = useToggleLockAccount();
  const { mutate: deleteAccount } = useDeleteAccount();

  const filtered = useMemo(() => {
    return accounts.filter((u) => {
      const matchRole = !roleFilter || u.role === roleFilter;
      const matchSearch =
        !search || u.username.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [accounts, roleFilter, search]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-display font-bold text-ink">
        Quản lý tài khoản
      </h1>

      <div className="flex gap-3">
        <input
          placeholder="Lọc theo username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-line rounded-tag px-3 py-2 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-line rounded-tag px-3 py-2 text-sm"
        >
          <option value="">Tất cả role</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <table className="w-full text-sm border border-line">
        <thead className="bg-paper">
          <tr className="text-left">
            <th className="p-3">Username</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={5} className="p-4 text-center">
                Đang tải...
              </td>
            </tr>
          )}
          {filtered.map((u) => (
            <tr key={u.id} className="border-t border-line">
              <td className="p-3">{u.username}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>
              <td className="p-3">
                {u.isLocked ? (
                  <span className="text-rust">Đã khóa</span>
                ) : (
                  <span className="text-green-600">Hoạt động</span>
                )}
              </td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() =>
                    toggleLock({ id: u.id, isLocked: !u.isLocked })
                  }
                  className="text-gold hover:underline"
                >
                  {u.isLocked ? "Mở khóa" : "Khóa"}
                </button>
                {u.role !== "admin" && (
                  <button
                    onClick={() =>
                      window.confirm("Xóa tài khoản này?") &&
                      deleteAccount(u.id)
                    }
                    className="text-rust hover:underline"
                  >
                    Xóa
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
