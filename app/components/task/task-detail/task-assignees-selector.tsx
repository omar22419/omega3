import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";
import type { ProjectMemberRole, Task, User } from "@/types";
import { useUpdateTaskAssigneesMutation } from "@/hooks/mutations/use-task-mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface Props {
  task: Task;
  assignees: User[];
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export function TaskAssigneesSelector({ task, assignees, projectMembers }: Props) {
  const [selected, setSelected] = useState<string[]>(assignees.map(a => a._id));
  const [open, setOpen]         = useState(false);
  const { mutate, isPending }   = useUpdateTaskAssigneesMutation();

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const save = () => {
    mutate({ taskId: task._id, assignees: selected }, {
      onSuccess: () => { setOpen(false); toast.success("Assignees updated"); },
      onError:   () => toast.error("Failed to update assignees"),
    });
  };

  const selectedMembers = projectMembers.filter(m => selected.includes(m.user._id));

  return (
    <div className="space-y-2">
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedMembers.map(m => (
            <div key={m.user._id} className="flex items-center gap-1.5 rounded-full border border-[var(--border-color)] pl-1 pr-2.5 py-0.5">
              <Avatar style={{ width: 18, height: 18 }}>
                <AvatarImage src={m.user.profilePicture} />
                <AvatarFallback style={{ fontSize: 9, background: "var(--brand)", color: "#fff" }}>{getInitials(m.user.username)}</AvatarFallback>
              </Avatar>
              <span className="text-[12px] text-[var(--text-secondary)]">{m.user.username}</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full h-8 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-left text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors"
        >
          {selected.length === 0 ? "Assign members" : `${selected.length} assigned`}
        </button>

        {open && (
          <div className="absolute top-9 left-0 right-0 z-20 rounded-[8px] border border-[var(--border-color)] overflow-hidden shadow-lg" style={{ background: "var(--bg-secondary)" }}>
            <div className="max-h-44 overflow-y-auto">
              {projectMembers.map(m => (
                <label key={m.user._id} htmlFor={`asgn-${m.user._id}`}
                  className="flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--bg-hover)] cursor-pointer">
                  <input
                    type="checkbox"
                    id={`asgn-${m.user._id}`}
                    checked={selected.includes(m.user._id)}
                    onChange={() => toggle(m.user._id)}
                    className="w-4 h-4 rounded accent-[var(--brand)]"
                  />
                  <Avatar style={{ width: 20, height: 20 }}>
                    <AvatarImage src={m.user.profilePicture} />
                    <AvatarFallback style={{ fontSize: 9, background: "var(--brand)", color: "#fff" }}>{getInitials(m.user.username)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[13px] flex-1 truncate">{m.user.username}</span>
                  {selected.includes(m.user._id) && <Check size={13} style={{ color: "var(--brand)" }} />}
                </label>
              ))}
            </div>
            <div className="flex gap-2 p-2 border-t border-[var(--border-color)]">
              <button onClick={() => setOpen(false)} className="flex-1 h-7 rounded-[4px] border border-[var(--border-color)] text-[12px] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] transition-colors">Cancel</button>
              <button onClick={save} disabled={isPending} className="flex-1 h-7 rounded-[4px] bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-[12px] disabled:opacity-50 transition-colors">Save</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
