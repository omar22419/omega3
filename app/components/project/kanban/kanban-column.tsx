import type { Task, TaskStatus } from "@/types";
import { KanbanTaskCard } from "./kanban-task-card";

const COL_CONFIG: Record<TaskStatus, { accent: string }> = {
  "To Do":       { accent: "var(--status-todo)"     },
  "In Progress": { accent: "var(--status-progress)" },
  "Done":        { accent: "var(--status-done)"     },
};

interface Props {
  status: TaskStatus; tasks: Task[];
  workspaceId: string; projectId: string;
}

export function KanbanColumn({ status, tasks, workspaceId, projectId }: Props) {
  const { accent } = COL_CONFIG[status];
  return (
    <div className="flex flex-col min-w-[280px] flex-1 max-w-sm">
      <div
        className="flex items-center justify-between px-3 py-2 rounded-t-[8px] border border-b-0 border-[var(--border-color)]"
        style={{ borderTop: `3px solid ${accent}`, background: "var(--bg-secondary)" }}
      >
        <span className="text-[13px] font-medium text-[var(--text-primary)]">{status}</span>
        <span
          className="flex items-center justify-center min-w-[20px] h-5 rounded-full px-1.5 text-[11px] font-medium"
          style={{ background: `${accent}20`, color: accent }}
        >
          {tasks.length}
        </span>
      </div>
      <div
        className="flex-1 rounded-b-[8px] border border-[var(--border-color)] p-2 min-h-[200px]"
        style={{ background: "var(--bg-secondary)" }}
        role="group"
        aria-label={`${status} tasks`}
      >
        {tasks.length === 0 ? (
          <p className="text-center text-[12px] text-[var(--text-tertiary)] mt-8">No tasks</p>
        ) : (
          tasks.map(t => (
            <KanbanTaskCard key={t._id} task={t} workspaceId={workspaceId} projectId={projectId} />
          ))
        )}
      </div>
    </div>
  );
}
