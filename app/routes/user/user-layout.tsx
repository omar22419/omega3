import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/providers/auth-provider";
import { FullPageLoader } from "@/components/common/loader";

export default function UserLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <Outlet />
    </div>
  );
}
