import type { ActionType } from "@/types";
import {
  CheckSquare, FileEdit, CheckCircle, FolderPlus, FolderEdit,
  CheckCircle2, Building2, MessageSquare, UserPlus, UserMinus,
  LogIn, Upload, SquarePen,
} from "lucide-react";

const ICON_MAP: Record<ActionType, { icon: React.ElementType; bg: string; color: string }> = {
  created_task:      { icon: CheckSquare,    bg: "var(--status-done)",      color: "#fff" },
  created_subtask:   { icon: CheckSquare,    bg: "var(--status-done)",      color: "#fff" },
  updated_task:      { icon: FileEdit,       bg: "var(--status-progress)",  color: "#fff" },
  updated_subtask:   { icon: SquarePen,      bg: "var(--status-progress)",  color: "#fff" },
  completed_task:    { icon: CheckCircle,    bg: "var(--status-done)",      color: "#fff" },
  created_project:   { icon: FolderPlus,     bg: "var(--brand)",            color: "#fff" },
  updated_project:   { icon: FolderEdit,     bg: "var(--brand)",            color: "#fff" },
  completed_project: { icon: CheckCircle2,   bg: "var(--status-done)",      color: "#fff" },
  created_workspace: { icon: Building2,      bg: "var(--brand)",            color: "#fff" },
  updated_workspace: { icon: Building2,      bg: "var(--brand)",            color: "#fff" },
  added_comment:     { icon: MessageSquare,  bg: "var(--status-progress)",  color: "#fff" },
  added_member:      { icon: UserPlus,       bg: "var(--status-done)",      color: "#fff" },
  removed_member:    { icon: UserMinus,      bg: "var(--priority-high)",    color: "#fff" },
  joined_workspace:  { icon: LogIn,          bg: "var(--brand)",            color: "#fff" },
  added_attachment:  { icon: Upload,         bg: "var(--status-progress)",  color: "#fff" },
};

export function ActivityIcon({ action }: { action: ActionType }) {
  const cfg = ICON_MAP[action];
  if (!cfg) return null;
  const Icon = cfg.icon;
  return (
    <div
      className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0"
      style={{ background: `${cfg.bg}30` }}
      aria-hidden="true"
    >
      <Icon size={14} style={{ color: cfg.bg }} />
    </div>
  );
}
