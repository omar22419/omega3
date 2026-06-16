import { Link } from "react-router";
import type { Project } from "@/types";
import { StatusBadge } from "@/components/ui/badge";

interface Props { project: Project; workspaceId: string; }

export function ProjectCard({ project, workspaceId }: Props) {
  const total    = project.tasks?.length ?? 0;
  const done     = project.tasks?.filter(t => t.status === "Done").length ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${project._id}`}
      className="block rounded-[8px] border border-[var(--border-color)] p-4 hover:bg-[var(--bg-hover)] transition-colors"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-[14px] font-medium text-[var(--text-primary)] line-clamp-2 flex-1">
          {project.title}
        </h3>
        <StatusBadge variant="status" value={project.status} />
      </div>
      {project.description && (
        <p className="text-[13px] text-[var(--text-secondary)] line-clamp-2 mb-3">{project.description}</p>
      )}
      <div className="mb-1 flex items-center justify-between text-[11px] text-[var(--text-secondary)]">
        <span>Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, background: "var(--brand)" }}
          role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}
        />
      </div>
      {project.dueDate && (
        <p className="mt-3 text-[11px] text-[var(--text-tertiary)]">
          Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      )}
    </Link>
  );
}
