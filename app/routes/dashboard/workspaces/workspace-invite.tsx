import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Check, X, Loader2, AlertTriangle } from "lucide-react";
import { useAcceptGenerateInviteMutation, useAcceptInviteByTokenMutation } from "@/hooks/mutations/use-workspace-mutations";
import { useWorkspaceDetailsQuery } from "@/hooks/queries";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workspace } from "@/types";

export default function WorkspaceInvite() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [accepted, setAccepted] = useState(false);
  const token = searchParams.get("tk");

  const { data: wsData, isLoading } = useWorkspaceDetailsQuery(workspaceId ?? "");
  const workspace = wsData?.data as Workspace | undefined;

  const { mutate: acceptByToken, isPending: isPendingToken } = useAcceptInviteByTokenMutation();
  const { mutate: acceptByLink,  isPending: isPendingLink  } = useAcceptGenerateInviteMutation();
  const isPending = isPendingToken || isPendingLink;

  useEffect(() => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/sign-in?redirect=${returnUrl}`, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleAccept = () => {
    if (!workspaceId) return;
    const onSuccess = () => {
      setAccepted(true);
      toast.success("You joined the workspace!");
      setTimeout(() => navigate(`/workspaces/${workspaceId}`), 1800);
    };
    const onError = (err: unknown) => {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to accept invite");
    };
    if (token) acceptByToken(token, { onSuccess, onError });
    else       acceptByLink(workspaceId, { onSuccess, onError });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm rounded-[12px] border border-[var(--border-color)] p-8 text-center" style={{ background: "var(--bg-secondary)" }}>
        <div className="w-10 h-10 rounded-[8px] bg-[var(--brand)] flex items-center justify-center text-white font-bold text-[18px] mx-auto mb-6 select-none">Ω</div>

        {accepted ? (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--status-done)", opacity: 0.15 }}>
              <Check size={24} style={{ color: "var(--status-done)" }} />
            </div>
            <p className="font-semibold text-[16px] mb-1">You're in!</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Redirecting to your workspace…</p>
          </>
        ) : isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-12 rounded-[8px] mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
            <Skeleton className="h-3 w-56 mx-auto" />
          </div>
        ) : !workspace ? (
          <>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--priority-high)]/10">
              <AlertTriangle size={22} className="text-[var(--priority-high)]" />
            </div>
            <p className="font-semibold text-[16px] mb-1">Invalid invitation</p>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6">This invite link is invalid or has expired.</p>
            <Button variant="secondary" className="w-full" onClick={() => navigate("/workspaces")}>Go to workspaces</Button>
          </>
        ) : (
          <>
            <div
              className="w-14 h-14 rounded-[8px] flex items-center justify-center text-white font-bold text-[20px] mx-auto mb-4 select-none"
              style={{ background: workspace.color ?? "var(--brand)" }}
            >
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="font-semibold text-[16px] mb-1">{workspace.name}</p>
            {workspace.description && (
              <p className="text-[13px] text-[var(--text-secondary)] mb-2">{workspace.description}</p>
            )}
            <p className="text-[12px] text-[var(--text-tertiary)] mb-6">{workspace.members?.length ?? 0} members</p>
            <p className="text-[13px] text-[var(--text-secondary)] mb-6">You've been invited to join this workspace.</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => navigate("/workspaces")} disabled={isPending}>
                <X size={14} /> Decline
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAccept} disabled={isPending}>
                {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {isPending ? "Joining…" : "Accept"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
