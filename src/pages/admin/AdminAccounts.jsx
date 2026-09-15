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

const inputClass = "border border-line rounded-tag px-3 py-2 text-sm w-full";

function AccountModal({ mode, account, onClose }) {
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
    <div className="fixed inset-0 bg-ink/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-tag p-6 w-full max-w-md">
        <h2 className="font-bold mb-4">
          {isEdit ? "Sửa tài khoản" : "Thêm tài khoản"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {isEdit ? (
            <>
              <div className="grid grid-cols-2 gap-3">
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

          <div className="flex gap-2 pt-2">
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
              className="btn-secondary flex-1"
            >
              Đóng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAccounts() {
  const [columnFilters, setColumnFilters] = useState({
    username: "",
    email: "",
    role: "",
  });
  const [modal, setModal] = useState(null); // mode: "create" | "edit", account?

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-display font-bold text-ink">
          Quản lý tài khoản
        </h1>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="btn-primary text-sm px-4 py-2"
        >
          + Thêm tài khoản
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-line">
          <thead className="bg-paper">
            <tr className="text-left">
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Trạng thái</th>
              <th className="p-3">Hành động</th>
            </tr>
            <tr className="bg-white border-t border-line">
              <th className="p-2">
                <input
                  value={columnFilters.username}
                  onChange={(e) =>
                    setColumnFilters((f) => ({
                      ...f,
                      username: e.target.value,
                    }))
                  }
                  placeholder="Lọc username..."
                  className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
                />
              </th>
              <th className="p-2">
                <input
                  value={columnFilters.email}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder="Lọc email..."
                  className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
                />
              </th>
              <th className="p-2">
                <select
                  value={columnFilters.role}
                  onChange={(e) =>
                    setColumnFilters((f) => ({ ...f, role: e.target.value }))
                  }
                  className="w-full border border-line rounded px-2 py-1 text-xs font-normal"
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
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={5} />
              ))}
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
                <td className="p-3 flex gap-2 flex-wrap">
                  <button
                    onClick={() => setModal({ mode: "edit", account: u })}
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

      {modal && (
        <AccountModal
          mode={modal.mode}
          account={modal.account}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
