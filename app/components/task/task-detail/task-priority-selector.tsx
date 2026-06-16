import { toast } from "sonner";
import type { TaskPriority } from "@/types";
import { useUpdateTaskPriorityMutation } from "@/hooks/mutations/use-task-mutations";
import { StatusBadge } from "@/components/ui/badge";

const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];
const SEL_CLS = "h-8 pl-2 pr-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] cursor-pointer";

export function TaskPrioritySelector({ priority, taskId }: { priority: TaskPriority; taskId: string }) {
  const { mutate, isPending } = useUpdateTaskPriorityMutation();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutate({ taskId, priority: e.target.value as TaskPriority }, {
      onSuccess: () => toast.success("Priority updated"),
      onError:   () => toast.error("Failed to update priority"),
    });
  };
  return (
    <div className="flex items-center gap-2">
      <StatusBadge variant="priority" value={priority} />
      <select value={priority} onChange={handleChange} disabled={isPending} className={SEL_CLS} aria-label="Change priority">
        {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}
