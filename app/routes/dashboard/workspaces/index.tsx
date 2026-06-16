import { useState } from "react";
import { Link } from "react-router";
import { Plus, FolderKanban, Users } from "lucide-react";
import { useWorkspacesQuery } from "@/hooks/queries";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import { formatDate } from "@/lib/utils";

export default function Workspaces() {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useWorkspacesQuery();
  const { setSelectedWorkspace } = useWorkspaceContext();
  const workspaces = data?.data ?? [];

  return (
    <div className="p-4 md:p-6 max-w-[1280px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="mb-1">Workspaces</h1>
          <p className="text-[var(--text-secondary)]">Organize your projects by team or department</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          <Plus size={16} /> New Workspace
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-[12px] bg-[var(--brand-light)] flex items-center justify-center mb-4">
            <FolderKanban size={28} className="text-[var(--brand)]" />
          </div>
          <h2 className="mb-2">No workspaces yet</h2>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm mb-6">
            Create your first workspace to start organizing projects and tasks.
          </p>
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Create workspace
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {workspaces.map(ws => (
            <Link key={ws._id} to={`/workspaces/${ws._id}`} onClick={() => setSelectedWorkspace(ws)}>
              <Card className="p-6 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-[8px] flex items-center justify-center text-white font-semibold text-[16px] shrink-0 select-none"
                    style={{ backgroundColor: ws.color }}
                  >
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-1 truncate">{ws.name}</h3>
                    <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{ws.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-4 text-[11px] text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5"><FolderKanban size={13} /> {0} projects</span>
                    <span className="flex items-center gap-1.5"><Users size={13} /> {ws.members.length} members</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateWorkspaceDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
