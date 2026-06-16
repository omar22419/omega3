import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, size = "md", className }: Props) {
  const iconBox = { sm: "w-10 h-10 rounded-[8px]",  md: "w-14 h-14 rounded-[10px]", lg: "w-16 h-16 rounded-[12px]" }[size];
  const iconSz  = { sm: 18, md: 24, lg: 28 }[size];
  const padY    = { sm: "py-8", md: "py-14", lg: "py-20" }[size];
  const titleSz = { sm: "text-[14px]", md: "text-[15px]", lg: "text-[16px]" }[size];

  return (
    <div className={cn("flex flex-col items-center justify-center text-center", padY, className)}>
      <div
        className={cn("flex items-center justify-center mb-4", iconBox)}
        style={{ background: "var(--brand-light)" }}
        aria-hidden="true"
      >
        <Icon size={iconSz} style={{ color: "var(--brand)" }} />
      </div>
      <p className={cn("font-medium text-[var(--text-primary)] mb-1", titleSz)}>{title}</p>
      {description && (
        <p className="text-[13px] text-[var(--text-secondary)] max-w-xs mb-5">{description}</p>
      )}
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
