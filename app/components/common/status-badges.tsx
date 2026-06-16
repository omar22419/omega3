import { StatusBadge } from "@/components/ui/badge";
import type { TaskStatus, TaskPriority } from "@/types";

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <StatusBadge variant="status" value={status} />;
}
export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return <StatusBadge variant="priority" value={priority} />;
}
export function RoleBadge({ role }: { role: string }) {
  return <StatusBadge variant="status" value={role} />;
}
