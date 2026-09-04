import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { AdminSidebar } from "../components/AdminSidebar";

export default function AdminLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!hasHydrated) return <div className="p-10 text-center">Đang tải...</div>;
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-paper overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
