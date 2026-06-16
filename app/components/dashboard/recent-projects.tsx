import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/badge";

interface Props { projects: Project[]; }

export function RecentProjects({ projects }: Props) {
  if (!projects.length) return null;
  return (
    <div className="space-y-3">
      {projects.slice(0, 5).map(p => {
        const workspaceId = typeof p.workspace === "object" ? p.workspace._id : p.workspace;
        const totalTasks = p.tasks?.length ?? 0;
        const doneTasks  = p.tasks?.filter(t => t.status === "Done").length ?? 0;
        const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        return (
          <Link
            key={p._id}
            to={`/workspaces/${workspaceId}/projects/${p._id}`}
            className="block p-3 rounded-[6px] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[13px] font-medium text-[var(--text-primary)] truncate flex-1 mr-2">{p.title}</p>
              <StatusBadge variant="status" value={p.status} />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "var(--brand)" }} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
