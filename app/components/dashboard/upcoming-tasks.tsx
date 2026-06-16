import { Link } from "react-router";
import type { Task } from "@/types";
import { StatusBadge } from "@/components/ui/badge";

interface Props { tasks: Task[]; }

export function UpcomingTasks({ tasks }: Props) {
  if (!tasks.length) return null;
  return (
    <div className="space-y-3">
      {tasks.slice(0, 6).map(task => {
        const projectId  = typeof task.project === "object" ? task.project._id : task.project;
        const workspaceId = typeof task.project === "object" && task.project.workspace
          ? (typeof task.project.workspace === "object" ? task.project.workspace._id : task.project.workspace)
          : null;
        const href = workspaceId ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}` : `/my-tasks`;
        const due  = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = due ? due < new Date() : false;

        return (
          <Link
            key={task._id}
            to={href}
            className="flex items-center justify-between p-3 rounded-[6px] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <StatusBadge variant="priority" value={task.priority} />
              <p className="text-[13px] text-[var(--text-primary)] truncate">{task.title}</p>
            </div>
            {due && (
              <span
                className="text-[11px] shrink-0 ml-3"
                style={{ color: isOverdue ? "var(--priority-high)" : "var(--text-secondary)" }}
              >
                {due.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
