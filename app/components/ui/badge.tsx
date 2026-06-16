import * as React from "react";
import { cn } from "@/lib/utils";

// Figma design: rounded-full, dot indicator, bg-status-*/10 text-status-*
interface BadgeProps extends React.ComponentProps<"span"> {
  variant?: "status" | "priority" | "role" | "default";
  value?: string;
}

function Badge({ className, variant = "default", value, children, ...props }: BadgeProps) {
  if ((variant === "status" || variant === "priority") && value) {
    return <StatusBadge variant={variant} value={value} className={className} />;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium",
        "bg-[var(--bg-hover)] text-[var(--text-secondary)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

function StatusBadge({ variant, value, className }: { variant: "status" | "priority"; value: string; className?: string }) {
  const getColors = () => {
    if (variant === "status") {
      switch (value.toLowerCase()) {
        case "to do":
        case "todo":       return { bg: "bg-[var(--status-todo)]/10",     text: "text-[var(--status-todo)]",     dot: "bg-[var(--status-todo)]" };
        case "in progress":
        case "in_progress":return { bg: "bg-[var(--status-progress)]/10", text: "text-[var(--status-progress)]", dot: "bg-[var(--status-progress)]" };
        case "done":       return { bg: "bg-[var(--status-done)]/10",     text: "text-[var(--status-done)]",     dot: "bg-[var(--status-done)]" };
        case "planning":   return { bg: "bg-[var(--status-todo)]/10",     text: "text-[var(--status-todo)]",     dot: "bg-[var(--status-todo)]" };
        case "completed":  return { bg: "bg-[var(--status-done)]/10",     text: "text-[var(--status-done)]",     dot: "bg-[var(--status-done)]" };
        case "on hold":    return { bg: "bg-[var(--priority-medium)]/10", text: "text-[var(--priority-medium)]", dot: "bg-[var(--priority-medium)]" };
        case "cancelled":  return { bg: "bg-[var(--priority-high)]/10",   text: "text-[var(--priority-high)]",   dot: "bg-[var(--priority-high)]" };
        default:           return { bg: "bg-[var(--text-tertiary)]/10",   text: "text-[var(--text-tertiary)]",   dot: "bg-[var(--text-tertiary)]" };
      }
    } else {
      switch (value.toLowerCase()) {
        case "high":   return { bg: "bg-[var(--priority-high)]/10",   text: "text-[var(--priority-high)]",   dot: "bg-[var(--priority-high)]" };
        case "medium": return { bg: "bg-[var(--priority-medium)]/10", text: "text-[var(--priority-medium)]", dot: "bg-[var(--priority-medium)]" };
        case "low":    return { bg: "bg-[var(--text-tertiary)]/10",   text: "text-[var(--text-tertiary)]",   dot: "bg-[var(--text-tertiary)]" };
        default:       return { bg: "bg-[var(--text-tertiary)]/10",   text: "text-[var(--text-tertiary)]",   dot: "bg-[var(--text-tertiary)]" };
      }
    }
  };

  const { bg, text, dot } = getColors();
  const label = value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0", bg, text, className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot)} aria-hidden="true" />
      {label}
    </span>
  );
}

export { Badge, StatusBadge };
