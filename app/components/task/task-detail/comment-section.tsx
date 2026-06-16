import { useState } from "react";
import { toast } from "sonner";
import { useTaskCommentsQuery } from "@/hooks/queries";
import { useAddCommentMutation } from "@/hooks/mutations/use-task-mutations";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelative, getInitials } from "@/lib/utils";

export function CommentSection({ taskId }: { taskId: string }) {
  const [text, setText] = useState("");
  const { data, isLoading } = useTaskCommentsQuery(taskId);
  const { mutate, isPending } = useAddCommentMutation();
  const comments = data?.data ?? [];

  const handleSubmit = () => {
    if (!text.trim()) return;
    mutate({ taskId, text: text.trim() }, {
      onSuccess: () => { setText(""); toast.success("Comment added"); },
      onError:   () => toast.error("Failed to add comment"),
    });
  };

  return (
    <div className="space-y-4">
      {/* Compose */}
      <div className="space-y-2">
        <textarea
          placeholder="Leave a comment…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
          rows={3}
          disabled={isPending}
          className="w-full px-3 py-2 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] text-[13px] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--text-tertiary)]">⌘ + Enter to submit</span>
          <button
            onClick={handleSubmit}
            disabled={isPending || !text.trim()}
            className="px-3 py-1.5 rounded-[6px] bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-[13px] disabled:opacity-50 transition-colors"
          >
            Comment
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2].map(i => (
            <div key={i} className="flex gap-2.5">
              <Skeleton className="w-7 h-7 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-[4px]" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--text-tertiary)] py-4">No comments yet.</p>
      ) : (
        <ul className="space-y-4">
          {comments.map(c => (
            <li key={c._id} className="flex gap-3">
              <Avatar style={{ width: 28, height: 28, flexShrink: 0 }}>
                <AvatarImage src={c.author?.profilePicture} />
                <AvatarFallback style={{ fontSize: 10, background: "var(--brand)", color: "#fff" }}>
                  {c.author ? getInitials(c.author.username) : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[13px] font-medium text-[var(--text-primary)]">{c.author?.username}</span>
                  <time className="text-[11px] text-[var(--text-tertiary)]">{formatRelative(c.createdAt)}</time>
                </div>
                <div className="rounded-[6px] border border-[var(--border-color)] px-3 py-2" style={{ background: "var(--bg-secondary)" }}>
                  <p className="text-[13px] text-[var(--text-secondary)] whitespace-pre-wrap">{c.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
