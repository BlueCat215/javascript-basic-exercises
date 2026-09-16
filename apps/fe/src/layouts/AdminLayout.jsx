import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { AdminSidebar } from "../pages/admin/components/AdminSidebar";
import { MenuIcon } from "../components/icons";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!hasHydrated) return <div className="p-10 text-center">Đang tải...</div>;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden flex items-center gap-3 border-b border-line bg-white px-4 py-3 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-ink/70 hover:text-ink"
            aria-label="Mở menu quản trị"
          >
            <MenuIcon size={22} />
          </button>
          <p className="font-display font-bold text-ink">Admin</p>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-paper overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
