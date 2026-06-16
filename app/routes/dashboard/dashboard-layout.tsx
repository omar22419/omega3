import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { useWorkspacesQuery } from "@/hooks/queries";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { FullPageLoader } from "@/components/common/loader";
import { ErrorBoundary } from "@/components/common/error-boundary";

export default function DashboardLayout() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setSelectedWorkspace, selectedWorkspace } = useWorkspaceContext();
  const [createOpen, setCreateOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const { data: wsData, isLoading: wsLoading } = useWorkspacesQuery();
  const workspaces = wsData?.data ?? [];

  // Hydrate workspace context from localStorage after workspaces load
  useEffect(() => {
    if (selectedWorkspace || workspaces.length === 0) return;
    const storedId = typeof window !== "undefined" ? localStorage.getItem("selectedWorkspaceId") : null;
    const match = workspaces.find((w) => w._id === storedId) ?? workspaces[0];
    if (match) setSelectedWorkspace(match);
  }, [workspaces, selectedWorkspace, setSelectedWorkspace]);

  if (authLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, static on md+ */}
      <div
        className={`fixed md:relative z-30 h-full transition-transform duration-200 md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar workspaces={workspaces} onClose={() => setMobileSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-auto" role="main">
          {wsLoading ? null : (
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          )}
        </main>
      </div>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
