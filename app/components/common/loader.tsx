import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeMap = { sm: 14, md: 20, lg: 28 };
  return (
    <div className={cn("flex items-center justify-center", size === "md" && "h-48", size === "lg" && "h-screen", className)} role="status" aria-label="Loading">
      <Loader2 size={sizeMap[size]} className="animate-spin text-[var(--text-tertiary)]" aria-hidden="true" />
    </div>
  );
}
export function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center" style={{ background: "var(--bg-primary)" }}>
      <Loader size="lg" />
    </div>
  );
}
