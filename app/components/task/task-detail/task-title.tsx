import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskTitleMutation } from "@/hooks/mutations/use-task-mutations";

export function TaskTitle({ title, taskId }: { title: string; taskId: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(title);
  const { mutate, isPending } = useUpdateTaskTitleMutation();

  const save = () => {
    if (!value.trim() || value === title) { setEditing(false); return; }
    mutate({ taskId, title: value.trim() }, {
      onSuccess: () => { setEditing(false); toast.success("Title updated"); },
      onError:   () => { toast.error("Failed to update title"); },
    });
  };

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") { setValue(title); setEditing(false); } }}
          disabled={isPending}
          autoFocus
          className="flex-1 h-10 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--brand)] text-[var(--text-primary)] text-[18px] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
        />
        <button onClick={save}   disabled={isPending} className="p-1.5 rounded bg-[var(--brand)] text-white" aria-label="Save"><Check size={14} /></button>
        <button onClick={() => { setValue(title); setEditing(false); }} className="p-1.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]" aria-label="Cancel"><X size={14} /></button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 group">
      <h1 className="flex-1 text-[20px] font-semibold text-[var(--text-primary)] leading-snug">{title}</h1>
      <button
        onClick={() => setEditing(true)}
        aria-label="Edit title"
        className="opacity-0 group-hover:opacity-100 mt-1 p-1.5 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}
