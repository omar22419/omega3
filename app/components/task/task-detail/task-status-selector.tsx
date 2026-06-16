import { toast } from "sonner";
import type { TaskStatus } from "@/types";
import { useUpdateTaskStatusMutation } from "@/hooks/mutations/use-task-mutations";
import { StatusBadge } from "@/components/ui/badge";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "Done"];
const SEL_CLS = "h-8 pl-2 pr-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] cursor-pointer";

export function TaskStatusSelector({ status, taskId }: { status: TaskStatus; taskId: string }) {
  const { mutate, isPending } = useUpdateTaskStatusMutation();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    mutate({ taskId, status: e.target.value as TaskStatus }, {
      onSuccess: () => toast.success("Status updated"),
      onError:   () => toast.error("Failed to update status"),
    });
  };
  return (
    <div className="flex items-center gap-2">
      <StatusBadge variant="status" value={status} />
      <select value={status} onChange={handleChange} disabled={isPending} className={SEL_CLS} aria-label="Change status">
        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
}
