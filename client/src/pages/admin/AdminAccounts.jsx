import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAdminAccountsQuery,
  useToggleLockAccount,
  useDeleteAccount,
  useCreateAccount,
  useUpdateAccount,
} from "./hooks/useAdminAccountQueries";
import {
  createAccountSchema,
  editAccountSchema,
} from "../../schemas/adminAccountSchema";
import { TableRowSkeleton } from "../../components/Skeleton";

const inputClass =
  "w-full border-b border-line bg-transparent py-2 text-sm focus:outline-none focus:border-gold transition-colors";
const filterInputClass =
  "w-full border-b border-line bg-transparent py-1 text-xs font-normal focus:outline-none focus:border-gold transition-colors";

function AccountPanel({ mode, account, onClose }) {
  const { mutate: createAccount, isPending: isCreating } = useCreateAccount();
  const { mutate: updateAccount, isPending: isUpdating } = useUpdateAccount();

  const isEdit = mode === "edit";
  const schema = isEdit ? editAccountSchema : createAccountSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: isEdit
      ? { name: account.name, email: account.email, role: account.role }
      : { role: "customer" },
  });

  const onSubmit = (data) => {
    if (isEdit) {
      updateAccount({ id: account.id, data }, { onSuccess: onClose });
    } else {
      createAccount(data, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-ink/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-md h-full bg-surface border-l border-line flex flex-col"
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-line shrink-0">
          <h2 className="font-display font-semibold text-ink">
            {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/40 hover:text-ink text-xl leading-none"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {isEdit ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    {...register("name.firstname")}
                    placeholder="Họ"
                    className={inputClass}
                  />
                  {errors.name?.firstname && (
                    <p className="text-rust text-xs mt-1">
                      {errors.name.firstname.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    {...register("name.lastname")}
                    placeholder="Tên"
                    className={inputClass}
                  />
                  {errors.name?.lastname && (
                    <p className="text-rust text-xs mt-1">
                      {errors.name.lastname.message}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-rust text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <input
                  {...register("username")}
                  placeholder="Username"
                  className={inputClass}
                />
                {errors.username && (
                  <p className="text-rust text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  {...register("email")}
                  placeholder="Email"
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-rust text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="Mật khẩu"
                  className={inputClass}
                />
                {errors.password && (
                  <p className="text-rust text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <select {...register("role")} className={inputClass}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-rust text-xs mt-1">{errors.role.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-line shrink-0">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {isCreating || isUpdating ? "Đang lưu..." : "Lưu"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-ink/60 hover:text-ink px-4"
          >
            Đóng
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminAccounts() {
  const [columnFilters, setColumnFilters] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [panel, setPanel] = useState(null); // mode: "create" | "edit", account?

  const { data: accounts = [], isLoading } = useAdminAccountsQuery();
  const { mutate: toggleLock } = useToggleLockAccount();
  const { mutate: deleteAccount } = useDeleteAccount();

  const filtered = useMemo(() => {
    return accounts.filter((u) => {
      const matchUsername =
        !columnFilters.username ||
        u.username.toLowerCase().includes(columnFilters.username.toLowerCase());
      const matchEmail =
        !columnFilters.email ||
        u.email.toLowerCase().includes(columnFilters.email.toLowerCase());
      const matchRole = !columnFilters.role || u.role === columnFilters.role;
      return matchUsername && matchEmail && matchRole;
    });
  }, [accounts, columnFilters]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-ink/50">Quản trị</p>
          <h1 className="text-xl font-display font-semibold text-ink mt-1">
            Tài khoản
          </h1>
        </div>
        <button
          onClick={() => setPanel({ mode: "create" })}
          className="btn-primary text-sm px-4 py-2"
        >
          + Thêm tài khoản
        </button>
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3 font-medium text-ink/60">Username</th>
              <th className="p-3 font-medium text-ink/60">Email</th>
              <th className="p-3 font-medium text-ink/60">Role</th>
              <th className="p-3 font-medium text-ink/60">Trạng thái</th>
              <th className="p-3 font-medium text-ink/60">Hành động</th>
            </tr>
            <tr className="bg-surface border-t border-line">
              <th className="p-2 font-normal">
                <input
                  value={columnFilters.username}
                  onChange={(e) =>
                    setColumnFilters((f) => ({
                      ...f,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Lọc username..."
                  className={filterInputClass}
                />
              </th>
              <th className="p-2 font-normal">
                <input
                  value={columnFilters.email}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="Lọc email..."
                  className={filterInputClass}
                />
              </th>
              <th className="p-2 font-normal">
                <select
                  value={columnFilters.role}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, role: e.target.value }))
                  }
                  className={filterInputClass}
                >
                  <option value="">Tất cả</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
              </th>
              <th className="p-2" />
              <th className="p-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))}
            {filtered.map((u) => (
              <tr key={u.id}>
                <td className="p-3">{u.username}</td>
                <td className="p-3 text-ink/70">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        u.isLocked ? "bg-rust" : "bg-green"
                      }`}
                    />
                    {u.isLocked ? "Đã khóa" : "Hoạt động"}
                  </span>
                </td>
                <td className="p-3 flex gap-3 flex-wrap">
                  <button
                    onClick={() => setPanel({ mode: "edit", account: u })}
                    className="text-gold hover:underline"
                  >
                    Sửa
                  </button>
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

      {panel && (
        <AccountPanel
          mode={panel.mode}
          account={panel.account}
          onClose={() => setPanel(null)}
        />
      )}
    </div>
  );
}
