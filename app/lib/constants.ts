import type { ProjectStatus, TaskPriority, TaskStatus } from "@/types";

export const PUBLIC_ROUTES = ["/", "/sign-in", "/sign-up", "/verify-email", "/reset-password", "/forgot-password"];

// ── Workspace colors ──────────────────────────────────────────────────────
export const WORKSPACE_COLORS = [
  "#6366F1", "#8B5CF6", "#EC4899", "#F43F5E", "#EF4444",
  "#F97316", "#EAB308", "#22C55E", "#10B981", "#14B8A6",
  "#06B6D4", "#3B82F6",
];

// ── Status config — Figma tokens ──────────────────────────────────────────
export const TASK_STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  "To Do":       { label: "To Do",        color: "var(--status-todo)"     },
  "In Progress": { label: "In Progress",  color: "var(--status-progress)" },
  "Done":        { label: "Done",         color: "var(--status-done)"     },
};

export const TASK_PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  High:   { label: "High",   color: "var(--priority-high)"   },
  Medium: { label: "Medium", color: "var(--priority-medium)" },
  Low:    { label: "Low",    color: "var(--status-todo)"     },
};

export const PROJECT_STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string }> = {
  Planning:     { label: "Planning",    color: "var(--status-todo)"     },
  "In Progress":{ label: "In Progress", color: "var(--status-progress)" },
  "On Hold":    { label: "On Hold",     color: "var(--priority-medium)" },
  Completed:    { label: "Completed",   color: "var(--status-done)"     },
  Cancelled:    { label: "Cancelled",   color: "var(--priority-high)"   },
};

export const getProjectProgress = (tasks: { status: TaskStatus }[]): number => {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter(t => t.status === "Done").length / tasks.length) * 100);
};
