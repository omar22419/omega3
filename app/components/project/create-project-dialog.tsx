import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { projectSchema, type ProjectFormData } from "@/lib/schemas";
import { ProjectStatus } from "@/types";
import type { WorkspaceMember } from "@/types";
import { useCreateProjectMutation } from "@/hooks/mutations/use-project-mutations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const LABEL = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)]";
const SEL   = "h-8 w-full px-2 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

interface Props {
  open: boolean; onOpenChange: (o: boolean) => void;
  workspaceId: string; workspaceMembers: WorkspaceMember[];
}

export function CreateProjectDialog({ open, onOpenChange, workspaceId, workspaceMembers }: Props) {
  const { mutate, isPending } = useCreateProjectMutation();

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "", status: ProjectStatus.PLANNING, startDate: "", dueDate: "", members: [], tags: "" },
  });

  const onSubmit = (values: ProjectFormData) => {
    mutate({ workspaceId, data: values }, {
      onSuccess: () => { toast.success("Project created"); form.reset(); onOpenChange(false); },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create project");
      },
    });
  };

  const dateBtn = (value: string, placeholder: string) =>
    cn("flex items-center gap-2 w-full h-8 px-3 rounded-[4px] border border-[var(--border-color)] text-[13px] text-left hover:bg-[var(--bg-hover)] transition-colors",
      !value ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[540px] max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 12 }}
      >
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">New project</DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--text-secondary)]">Organise tasks within this workspace.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField control={form.control} name="title" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Title</FormLabel>
                <FormControl><Input {...field} placeholder="Project name" autoFocus /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Description <span className="normal-case text-[var(--text-tertiary)]">(optional)</span></FormLabel>
                <FormControl><Textarea {...field} placeholder="What is this project about?" rows={2} className="resize-none text-[13px]" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="status" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Status</FormLabel>
                <select {...field} className={SEL}>
                  {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-3">
              {(["startDate", "dueDate"] as const).map(name => (
                <FormField key={name} control={form.control} name={name} render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>{name === "startDate" ? "Start date" : "Due date"}</FormLabel>
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <button type="button" className={dateBtn(field.value, "Pick a date")} style={{ background: "var(--bg-secondary)" }}>
                            <CalendarIcon size={14} className="text-[var(--text-tertiary)]" />
                            {field.value ? format(new Date(field.value), "MMM d, yyyy") : "Pick a date"}
                          </button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8 }}>
                        <Calendar mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={d => field.onChange(d?.toISOString() ?? "")} />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                  </FormItem>
                )} />
              ))}
            </div>

            <FormField control={form.control} name="tags" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Tags <span className="normal-case text-[var(--text-tertiary)]">(comma-separated, optional)</span></FormLabel>
                <FormControl><Input {...field} placeholder="design, backend, urgent" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            {workspaceMembers.length > 0 && (
              <FormField control={form.control} name="members" render={({ field }) => {
                const selected = field.value ?? [];
                return (
                  <FormItem>
                    <FormLabel className={LABEL}>Members</FormLabel>
                    <div className="rounded-[4px] border border-[var(--border-color)] max-h-44 overflow-y-auto" style={{ background: "var(--bg-primary)" }}>
                      {workspaceMembers.map(m => {
                        const isSel = selected.some(s => s.user === m.user._id);
                        const sel   = selected.find(s => s.user === m.user._id);
                        return (
                          <label key={m._id} htmlFor={`pm-${m.user._id}`}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-[var(--bg-hover)] cursor-pointer border-b border-[var(--border-color)] last:border-0">
                            <input type="checkbox" id={`pm-${m.user._id}`} checked={isSel}
                              onChange={e => field.onChange(e.target.checked
                                ? [...selected, { user: m.user._id, role: "contributor" }]
                                : selected.filter(s => s.user !== m.user._id)
                              )}
                              className="w-4 h-4 accent-[var(--brand)]"
                            />
                            <Avatar style={{ width: 20, height: 20 }}>
                              <AvatarImage src={m.user.profilePicture} />
                              <AvatarFallback style={{ fontSize: 9, background: "var(--brand)", color: "#fff" }}>{getInitials(m.user.username)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[13px] flex-1 truncate">{m.user.username}</span>
                            {isSel && (
                              <select
                                value={sel?.role ?? "contributor"}
                                onChange={e => field.onChange(selected.map(s => s.user === m.user._id ? { ...s, role: e.target.value as "manager" | "contributor" | "viewer" } : s))}
                                className="h-6 text-[11px] rounded px-1 border border-[var(--border-color)]"
                                style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
                                onClick={e => e.stopPropagation()}
                              >
                                <option value="manager">Manager</option>
                                <option value="contributor">Contributor</option>
                                <option value="viewer">Viewer</option>
                              </select>
                            )}
                          </label>
                        );
                      })}
                    </div>
                    <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                  </FormItem>
                );
              }} />
            )}

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Creating…" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
