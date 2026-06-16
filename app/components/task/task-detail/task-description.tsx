import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useUpdateTaskDescriptionMutation } from "@/hooks/mutations/use-task-mutations";

export function TaskDescription({ description, taskId }: { description?: string; taskId: string }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue]     = useState(description ?? "");
  const { mutate, isPending } = useUpdateTaskDescriptionMutation();

  const save = () => {
    mutate({ taskId, description: value }, {
      onSuccess: () => { setEditing(false); toast.success("Description updated"); },
      onError:   () => { toast.error("Failed to update description"); },
    });
  };

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={4}
          disabled={isPending}
          autoFocus
          placeholder="Add a description…"
          className="w-full px-3 py-2 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--brand)] text-[var(--text-primary)] text-[13px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none"
        />
        <div className="flex gap-2">
          <button onClick={save} disabled={isPending} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--brand)] text-white text-[13px]">
            <Check size={13} /> Save
          </button>
          <button onClick={() => { setValue(description ?? ""); setEditing(false); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-[var(--bg-hover)] text-[var(--text-secondary)] text-[13px]">
            <X size={13} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="cursor-text p-2 -m-2 rounded-[6px] hover:bg-[var(--bg-hover)] transition-colors group"
      role="button"
      tabIndex={0}
      aria-label="Edit description"
      onKeyDown={e => e.key === "Enter" && setEditing(true)}
    >
      {description ? (
        <p className="text-[13px] text-[var(--text-secondary)] whitespace-pre-wrap">{description}</p>
      ) : (
        <p className="text-[13px] text-[var(--text-tertiary)] italic flex items-center gap-2">
          <Pencil size={13} aria-hidden="true" /> Add a description…
        </p>
      )}
    </div>
  );
}
