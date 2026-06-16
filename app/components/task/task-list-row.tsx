import { Link } from "react-router";
import type { Task } from "@/types";
import { StatusBadge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";

interface Props { task: Task; }

export function TaskListRow({ task }: Props) {
  const projectId  = typeof task.project === "object" ? task.project._id : task.project;
  const workspaceId = typeof task.project === "object" && task.project.workspace
    ? (typeof task.project.workspace === "object" ? task.project.workspace._id : task.project.workspace)
    : null;
  const href = workspaceId ? `/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}` : "#";
  const assigneeUsers = (task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }));

  return (
    <tr className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
      <td className="p-4">
        <Link to={href} className="block">
          <div className="text-[14px] font-medium text-[var(--text-primary)] truncate max-w-xs">{task.title}</div>
          <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
            {typeof task.project === "object" ? task.project.title : ""}
          </div>
        </Link>
      </td>
      <td className="p-4"><StatusBadge variant="priority" value={task.priority} /></td>
      <td className="p-4"><StatusBadge variant="status"   value={task.status}   /></td>
      <td className="p-4 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          : "—"}
      </td>
      <td className="p-4">
        <AvatarGroup users={assigneeUsers} max={3} size={24} />
      </td>
    </tr>
  );
}
