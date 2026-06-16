import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-[4px]", className)} aria-hidden="true" />;
}
export function SkeletonStatCard() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[8px] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-2.5 w-20" />
        <Skeleton className="size-7 rounded-[6px]" />
      </div>
      <Skeleton className="h-7 w-14" />
      <Skeleton className="h-2.5 w-28" />
    </div>
  );
}
export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-[var(--border-color)]">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-3 flex-1 max-w-xs" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[8px] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-[8px]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-2.5 w-3/4" />
    </div>
  );
}
