import { Link } from "react-router";
import type { Task } from "@/types";
import { StatusBadge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";

interface Props { task: Task; }

export function TaskBoardCard({ task }: Props) {
  const projectId  = typeof task.project === "object" ? task.project._id : task.project;
  const workspaceId = typeof task.project === "object" && task.project.workspace
    ? (typeof task.project.workspace === "object" ? task.project.workspace._id : task.project.workspace)
    : null;
  const href = workspaceId ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}` : "#";
  const assigneeUsers = (task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }));

  return (
    <Link
      to={href}
      className="block rounded-[8px] border border-[var(--border-color)] p-4 hover:bg-[var(--bg-hover)] transition-colors"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-[14px] font-medium text-[var(--text-primary)] line-clamp-2 flex-1">{task.title}</p>
        <StatusBadge variant="priority" value={task.priority} />
      </div>
      <StatusBadge variant="status" value={task.status} />
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-color)]">
        <AvatarGroup users={assigneeUsers} max={3} size={22} />
        {task.dueDate && (
          <span className="text-[11px] text-[var(--text-secondary)]">
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </Link>
  );
}
