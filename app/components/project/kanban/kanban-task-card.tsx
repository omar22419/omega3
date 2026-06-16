import { Link } from "react-router";
import type { Task } from "@/types";
import { StatusBadge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";

interface Props { task: Task; workspaceId: string; projectId: string; }

export function KanbanTaskCard({ task, workspaceId, projectId }: Props) {
  const assigneeUsers = (task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }));

  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
      className="block rounded-[6px] border border-[var(--border-color)] p-3 mb-2 hover:bg-[var(--bg-hover)] transition-colors"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[14px] font-medium text-[var(--text-primary)] line-clamp-2 flex-1">
          {task.title}
        </p>
        <StatusBadge variant="priority" value={task.priority} />
      </div>
      {task.description && (
        <p className="text-[12px] text-[var(--text-secondary)] line-clamp-1 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
        <AvatarGroup users={assigneeUsers} max={3} size={20} />
        {task.dueDate && (
          <span className="text-[11px] text-[var(--text-secondary)]">
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>
    </Link>
  );
}
