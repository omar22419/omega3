import { useState } from "react";
import { useParams, Link } from "react-router";
import { Plus, UserPlus } from "lucide-react";
import { useWorkspaceWithProjectsQuery } from "@/hooks/queries";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateProjectDialog } from "@/components/project/create-project-dialog";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import type { WorkspaceMember } from "@/types";

export default function WorkspaceDetails() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { setSelectedWorkspace } = useWorkspaceContext();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data, isLoading } = useWorkspaceWithProjectsQuery(workspaceId ?? "");
  const workspace = data?.data?.workspace;
  const projects  = data?.data?.projects ?? [];

  if (workspace) setSelectedWorkspace(workspace);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-[1280px] mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-[8px]" />
          <div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-3 w-60" /></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-40 rounded-[8px]" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-[1280px] mx-auto">
      {/* Workspace header */}
      <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6 mb-8">
        <div
          className="w-16 h-16 rounded-[8px] flex items-center justify-center text-white font-semibold text-[20px] shrink-0 select-none"
          style={{ backgroundColor: workspace?.color ?? "#6366F1" }}
        >
          {workspace?.name?.charAt(0)?.toUpperCase() ?? "W"}
        </div>
        <div className="flex-1">
          <h1 className="mb-1">{workspace?.name}</h1>
          <p className="text-[var(--text-secondary)] mb-3">{workspace?.description}</p>
          <p className="text-[13px] text-[var(--text-tertiary)]">
            {workspace?.members.length ?? 0} members · {projects.length} projects
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={() => setInviteOpen(true)}>
            <UserPlus size={16} /> Invite
          </Button>
          <Button variant="primary" onClick={() => setCreateProjectOpen(true)}>
            <Plus size={16} /> New Project
          </Button>
        </div>
      </div>

      {/* Projects */}
      <h2 className="mb-4">Projects</h2>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[var(--border-color)] rounded-[8px]">
          <p className="text-[var(--text-primary)] font-medium mb-1">No projects yet</p>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">Create your first project to start organizing tasks.</p>
          <Button variant="primary" onClick={() => setCreateProjectOpen(true)}>
            <Plus size={16} /> New project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => {
            const totalTasks = project.tasks?.length ?? 0;
            const doneTasks  = project.tasks?.filter(t => t.status === "Done").length ?? 0;
            const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
            return (
              <Link key={project._id} to={`/workspaces/${workspaceId}/projects/${project._id}`}>
                <Card className="p-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{project.title}</h3>
                      <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2">{project.description}</p>
                    </div>
                    <StatusBadge variant="status" value={project.status} />
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                      <span>Progress</span><span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--brand)] rounded-full" style={{ width: `${progress}%` }}
                        role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
                    </div>
                  </div>
                  {project.dueDate && (
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <CreateProjectDialog
        open={createProjectOpen}
        onOpenChange={setCreateProjectOpen}
        workspaceId={workspaceId ?? ""}
        workspaceMembers={(workspace?.members ?? []) as WorkspaceMember[]}
      />
      <InviteMemberDialog open={inviteOpen} onOpenChange={setInviteOpen} workspaceId={workspaceId ?? ""} />
    </div>
  );
}
