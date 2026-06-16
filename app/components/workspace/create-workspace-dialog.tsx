import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { workspaceSchema, type WorkspaceFormData } from "@/lib/schemas";
import { WORKSPACE_COLORS } from "@/lib/constants";
import { useCreateWorkspaceMutation } from "@/hooks/mutations/use-workspace-mutations";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ApiResponse, Workspace } from "@/types";
import { useWorkspaceContext } from "@/providers/workspace-provider";

const LABEL = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)]";

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

export function CreateWorkspaceDialog({ open, onOpenChange }: Props) {
  const navigate = useNavigate();
  const { setSelectedWorkspace } = useWorkspaceContext();
  const { mutate, isPending } = useCreateWorkspaceMutation();

  const form = useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: "", color: WORKSPACE_COLORS[0], description: "" },
  });

  const onSubmit = (values: WorkspaceFormData) => {
    mutate(values, {
      onSuccess: (res) => {
        const workspace = (res as ApiResponse<Workspace[]>).data[0];
        form.reset();
        onOpenChange(false);
        toast.success("Workspace created");
        if (workspace) {
          setSelectedWorkspace(workspace);
          navigate(`/workspaces/${workspace._id}`);
        }
      },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to create workspace");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[460px]"
        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 12 }}
      >
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">New workspace</DialogTitle>
          <DialogDescription className="text-[13px] text-[var(--text-secondary)]">
            Workspaces are shared environments for team collaboration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Name</FormLabel>
                <FormControl><Input {...field} placeholder="e.g. Engineering, Marketing…" autoFocus /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Description <span className="normal-case text-[var(--text-tertiary)]">(optional)</span></FormLabel>
                <FormControl><Textarea {...field} placeholder="What does this workspace contain?" rows={2} className="resize-none text-[13px]" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <FormField control={form.control} name="color" render={({ field }) => (
              <FormItem>
                <FormLabel className={LABEL}>Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Workspace color">
                    {WORKSPACE_COLORS.map(color => (
                      <button
                        key={color}
                        type="button"
                        role="radio"
                        aria-checked={field.value === color}
                        aria-label={color}
                        onClick={() => field.onChange(color)}
                        className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-1"
                        style={{
                          backgroundColor: color,
                          outline: field.value === color ? `2px solid var(--text-primary)` : "none",
                          outlineOffset: 2,
                        }}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Creating…" : "Create workspace"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
