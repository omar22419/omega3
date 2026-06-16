import type { Task } from "@/types";
import { KanbanColumn } from "./kanban-column";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KanbanBoardProps {
  tasks: Task[];
  workspaceId: string;
  projectId: string;
}

const STATUSES = ["To Do", "In Progress", "Done"] as const;

export function KanbanBoard({ tasks, workspaceId, projectId }: KanbanBoardProps) {
  const byStatus = (status: string) => tasks.filter((t) => t.status === status);

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={byStatus(status)}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        ))}
      </div>
    </div>
  );
}
