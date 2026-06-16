import { useTaskActivityQuery } from "@/hooks/queries";
import { ActivityIcon } from "./task-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative, getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function TaskActivity({ taskId }: { taskId: string }) {
  const { data, isLoading } = useTaskActivityQuery(taskId);
  const activities = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading activity">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-start gap-2.5">
            <Skeleton className="w-7 h-7 rounded-[6px] shrink-0" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities.length) {
    return <p className="text-[13px] text-[var(--text-tertiary)]">No activity yet.</p>;
  }

  return (
    <ol className="space-y-3" aria-label="Task activity">
      {activities.map(log => (
        <li key={log._id} className="flex items-start gap-2.5">
          <ActivityIcon action={log.action} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Avatar style={{ width: 16, height: 16 }}>
                <AvatarImage src={log.user?.profilePicture} />
                <AvatarFallback style={{ fontSize: 8, background: "var(--brand)", color: "#fff" }}>
                  {log.user ? getInitials(log.user.username) : "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-[13px] font-medium text-[var(--text-primary)] truncate">
                {log.user?.username ?? "Unknown"}
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {(log.details as Record<string, string> | undefined)?.description
                ?? log.action.replace(/_/g, " ")}
            </p>
            <time
              dateTime={new Date(log.createdAt).toISOString()}
              className="text-[11px] text-[var(--text-tertiary)]"
            >
              {formatRelative(log.createdAt)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}
