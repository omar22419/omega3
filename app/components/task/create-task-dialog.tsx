import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { createTaskSchema, type CreateTaskFormData } from "@/lib/schemas";
import type { ProjectMember } from "@/types";
import { useCreateTaskMutation } from "@/hooks/mutations/use-task-mutations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { AvatarGroup, Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const LABEL = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)]";
const SEL   = "h-8 w-full px-2 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  projectId: string;
  projectMembers: ProjectMember[];
}

export function CreateTaskDialog({ open, onOpenChange, projectId, projectMembers }: Props) {
  const { mutate, isPending } = useCreateTaskMutation();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: "", description: "", status: "To Do", priority: "Medium", dueDate: "", assignees: [] },
  });

  const onSubmit = (values: CreateTaskFormData) => {
    mutate({ projectId, data: values }, {
      onSuccess: () => { toast.success("Task created"); form.reset(); onOpenChange(false); },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create task");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 12 }}
      >
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">New task</DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--text-secondary)]">Add a task to this project.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Title */}
            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Title</FormLabel>
                <FormControl><Input {...field} placeholder="Task name" autoFocus /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            {/* Description */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Description <span className="normal-case text-[var(--text-tertiary)]">(optional)</span></FormLabel>
                <FormControl><Textarea {...field} placeholder="Add details…" rows={2} className="resize-none text-[13px]" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            {/* Status + Priority */}
            <div className="grid grid-cols-2 gap-3">
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Status</FormLabel>
                  <select {...field} className={SEL}>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />

              <FormField control={form.control} name="priority" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Priority</FormLabel>
                  <select {...field} className={SEL}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />
            </div>

            {/* Due date */}
            <FormField control={form.control} name="dueDate" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Due date</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <button
                        type="button"
                        className={cn("flex items-center gap-2 w-full h-8 px-3 rounded-[4px] border border-[var(--border-color)] text-[13px] text-left transition-colors hover:bg-[var(--bg-hover)]",
                          !field.value ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
                        )}
                        style={{ background: "var(--bg-secondary)" }}
                      >
                        <CalendarIcon size={14} className="text-[var(--text-tertiary)]" />
                        {field.value ? format(new Date(field.value), "MMM d, yyyy") : "Pick a date"}
                      </button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }}>
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={d => field.onChange(d?.toISOString() ?? "")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            {/* Assignees */}
            {projectMembers.length > 0 && (
              <FormField control={form.control} name="assignees" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Assignees</FormLabel>
                  <div
                    className="rounded-[4px] border border-[var(--border-color)] max-h-40 overflow-y-auto"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    {projectMembers.map(m => {
                      const checked = field.value.includes(m.user._id);
                      return (
                        <label
                          key={m.user._id}
                          htmlFor={`t-asgn-${m.user._id}`}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-color)] last:border-0"
                        >
                          <input
                            type="checkbox"
                            id={`t-asgn-${m.user._id}`}
                            checked={checked}
                            onChange={e =>
                              field.onChange(
                                e.target.checked
                                  ? [...field.value, m.user._id]
                                  : field.value.filter(id => id !== m.user._id)
                              )
                            }
                            className="w-4 h-4 rounded accent-[var(--brand)]"
                          />
                          <Avatar style={{ width: 20, height: 20 }}>
                            <AvatarImage src={m.user.profilePicture} />
                            <AvatarFallback style={{ fontSize: 9, background: "var(--brand)", color: "#fff" }}>
                              {getInitials(m.user.username)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] text-[var(--text-primary)] flex-1 truncate">{m.user.username}</span>
                        </label>
                      );
                    })}
                  </div>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />
            )}

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Creating…" : "Create task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
