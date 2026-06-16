import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { inviteMemberSchema, type InviteMemberFormData } from "@/lib/schemas";
import { useInviteMemberMutation } from "@/hooks/mutations/use-workspace-mutations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ROLES = ["admin", "member", "viewer"] as const;
const LABEL = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)]";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export function InviteMemberDialog({ open, onOpenChange, workspaceId }: Props) {
  const [tab, setTab] = useState<"email" | "link">("email");
  const [copied, setCopied] = useState(false);
  const { mutate, isPending } = useInviteMemberMutation();

  const form = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "member" },
  });

  const inviteLink = typeof window !== "undefined" ? `${window.location.origin}/workspace-invite/${workspaceId}` : "";

  const onSubmit = (data: InviteMemberFormData) => {
    mutate({ workspaceId, ...data }, {
      onSuccess: () => { toast.success("Invite sent"); form.reset(); onOpenChange(false); },
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed"),
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 12 }}>
        <DialogHeader>
          <DialogTitle className="text-[16px] font-semibold">Invite member</DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-color)] mb-4">
          {(["email", "link"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-[13px] capitalize border-b-2 transition-colors ${tab === t ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--text-secondary)]"}`}>
              {t === "email" ? "Email invite" : "Invite link"}
            </button>
          ))}
        </div>

        {tab === "email" ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Email address</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="colleague@company.com" autoFocus /></FormControl>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />

              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Role</FormLabel>
                  <FormControl>
                    <div className="flex gap-2" role="radiogroup">
                      {ROLES.map(role => (
                        <button key={role} type="button" role="radio" aria-checked={field.value === role}
                          onClick={() => field.onChange(role)}
                          className={cn("flex-1 h-8 rounded-[4px] border text-[13px] capitalize transition-colors", field.value === role ? "border-[var(--brand)] text-[var(--brand)]" : "border-[var(--border-color)] text-[var(--text-secondary)]")}
                          style={field.value === role ? { background: "var(--brand-light)" } : {}}>
                          {role}
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />

              <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
                <Mail size={14} /> {isPending ? "Sending…" : "Send invite"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Shareable link</p>
            <div className="flex gap-2">
              <input readOnly value={inviteLink} className="flex-1 h-8 px-3 rounded-[4px] text-[12px] text-[var(--text-secondary)] border border-[var(--border-color)]" style={{ background: "var(--bg-primary)" }} />
              <Button variant="secondary" size="sm" onClick={handleCopy}>
                {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
              </Button>
            </div>
            <p className="text-[12px] text-[var(--text-tertiary)]">Anyone with this link can join as a member.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
