import { useState } from "react";
import { toast } from "sonner";
import type { Subtask } from "@/types";
import { useAddSubTaskMutation, useUpdateSubTaskMutation } from "@/hooks/mutations/use-task-mutations";

export function SubTasksDetails({ subTasks, taskId }: { subTasks: Subtask[]; taskId: string }) {
  const [newTask, setNewTask] = useState("");
  const { mutate: addSubTask,    isPending: isAdding   } = useAddSubTaskMutation();
  const { mutate: updateSubTask, isPending: isUpdating } = useUpdateSubTaskMutation();

  const completed = subTasks.filter(s => s.completed).length;
  const progress  = subTasks.length > 0 ? Math.round((completed / subTasks.length) * 100) : 0;

  const handleAdd = () => {
    if (!newTask.trim()) return;
    addSubTask({ taskId, title: newTask.trim() }, {
      onSuccess: () => { setNewTask(""); toast.success("Subtask added"); },
      onError:   () => toast.error("Failed to add subtask"),
    });
  };

  const handleToggle = (subTaskId: string, checked: boolean) => {
    updateSubTask({ taskId, subTaskId, completed: checked }, {
      onError: () => toast.error("Failed to update subtask"),
    });
  };

  return (
    <div className="space-y-3">
      {subTasks.length > 0 && (
        <div>
          <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
            <span>{completed} / {subTasks.length} completed</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-hover)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: "var(--brand)" }}
              role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} />
          </div>
        </div>
      )}

      <div className="space-y-1">
        {subTasks.map(s => (
          <label key={s._id} htmlFor={`sub-${s._id}`}
            className="flex items-center gap-3 p-2 rounded-[6px] hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
            <input
              type="checkbox"
              id={`sub-${s._id}`}
              checked={s.completed}
              onChange={e => handleToggle(s._id, e.target.checked)}
              disabled={isUpdating}
              className="w-4 h-4 rounded accent-[var(--brand)]"
            />
            <span className={`text-[13px] flex-1 ${s.completed ? "line-through text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"}`}>
              {s.title}
            </span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          placeholder="Add a subtask…"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          disabled={isAdding}
          className="flex-1 h-8 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
        <button
          onClick={handleAdd}
          disabled={isAdding || !newTask.trim()}
          className="px-3 h-8 rounded-[4px] bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-[13px] disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
