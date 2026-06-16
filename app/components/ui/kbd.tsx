import { cn } from "@/lib/utils";
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex items-center justify-center rounded px-1.5 py-0.5 font-mono text-[11px] border border-[var(--border-color)] text-[var(--text-tertiary)]", className)}
      style={{ background: "var(--bg-hover)" }}>
      {children}
    </kbd>
  );
}
