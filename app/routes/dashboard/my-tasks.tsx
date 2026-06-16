import { useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import { Search, List, LayoutGrid } from "lucide-react";
import { useMyTasksQuery } from "@/hooks/queries";
import { StatusBadge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AvatarGroup } from "@/components/ui/avatar";
import { SkeletonTableRow } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";

const FILTER_OPTIONS = [
  { value: "all",        label: "All Status" },
  { value: "todo",       label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done",       label: "Done" },
  { value: "achieved",   label: "Achieved" },
  { value: "high",       label: "High Priority" },
] as const;

type FilterValue = typeof FILTER_OPTIONS[number]["value"];

function matchesFilter(task: Task, f: FilterValue) {
  switch (f) {
    case "todo":       return task.status === "To Do";
    case "inprogress": return task.status === "In Progress";
    case "done":       return task.status === "Done";
    case "achieved":   return task.isAchieved === true;
    case "high":       return task.priority === "High";
    default:           return true;
  }
}

const SELECT_CLS = "h-8 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]";

export default function MyTasks() {
  const [params, setParams] = useSearchParams();

  const view   = (params.get("view")   ?? "list") as "list" | "grid";
  const filter = (params.get("filter") ?? "all")  as FilterValue;
  const sort   = (params.get("sort")   ?? "desc") as "asc" | "desc";
  const search = params.get("search") ?? "";

  const set = (k: string, v: string) =>
    setParams(p => { p.set(k, v); return p; }, { replace: true });

  const { data, isLoading } = useMyTasksQuery();
  const all: Task[] = data?.data ?? [];

  const tasks = useMemo(() => {
    return all
      .filter(t => matchesFilter(t, filter))
      .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => sort === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [all, filter, sort, search]);

  const getTaskHref = (t: Task) => {
    const pid = typeof t.project === "object" ? t.project._id : t.project;
    const wid = typeof t.project === "object" && t.project.workspace
      ? typeof t.project.workspace === "object" ? t.project.workspace._id : t.project.workspace
      : null;
    return wid ? `/workspaces/${wid}/projects/${pid}/tasks/${t._id}` : "#";
  };

  return (
    <div className="p-4 md:p-6 max-w-[1280px] mx-auto">
      <div className="mb-6">
        <h1 className="mb-1">My Tasks</h1>
        <p className="text-[var(--text-secondary)]">All tasks assigned to you across all projects</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
            <input
              placeholder="Search tasks..."
              value={search}
              onChange={e => set("search", e.target.value)}
              className={cn(SELECT_CLS, "pl-9 w-full")}
            />
          </div>
          {/* View toggle */}
          <div className="flex border border-[var(--border-color)] rounded-[4px] overflow-hidden shrink-0">
            <button
              onClick={() => set("view", "list")}
              className={`px-2 py-1.5 transition-colors ${view === "list" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}
              aria-label="List view" aria-pressed={view === "list"}
            ><List size={16} /></button>
            <button
              onClick={() => set("view", "grid")}
              className={`px-2 py-1.5 transition-colors ${view === "grid" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}
              aria-label="Grid view" aria-pressed={view === "grid"}
            ><LayoutGrid size={16} /></button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select value={filter} onChange={e => set("filter", e.target.value)} className={SELECT_CLS}>
            {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={sort} onChange={e => set("sort", e.target.value)} className={SELECT_CLS}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <Card>{[1,2,3,4,5].map(i => <SkeletonTableRow key={i} />)}</Card>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-[var(--text-primary)] font-medium mb-1">No tasks found</p>
          <p className="text-[13px] text-[var(--text-secondary)]">
            {search || filter !== "all" ? "Try adjusting your filters." : "Tasks assigned to you will appear here."}
          </p>
        </div>
      ) : view === "list" ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {["Task","Priority","Status","Due Date","Assigned"].map(h => (
                    <th key={h} className="text-left p-4 text-[11px] uppercase tracking-wide text-[var(--text-secondary)] font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4">
                      <Link to={getTaskHref(task)} className="block">
                        <div className="font-medium text-[14px] mb-0.5 truncate max-w-xs">{task.title}</div>
                        <div className="text-[11px] text-[var(--text-tertiary)]">
                          {typeof task.project === "object" ? task.project.title : ""}
                        </div>
                      </Link>
                    </td>
                    <td className="p-4"><StatusBadge variant="priority" value={task.priority} /></td>
                    <td className="p-4"><StatusBadge variant="status" value={task.status} /></td>
                    <td className="p-4 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="p-4">
                      <AvatarGroup users={(task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }))} max={3} size={24} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map(task => (
            <Link key={task._id} to={getTaskHref(task)}>
              <Card className="p-4 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-0.5 truncate">{task.title}</h3>
                    <p className="text-[11px] text-[var(--text-tertiary)]">
                      {typeof task.project === "object" ? task.project.title : ""}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <StatusBadge variant="priority" value={task.priority} />
                  <StatusBadge variant="status" value={task.status} />
                </div>
                <div className="flex items-center justify-between">
                  <AvatarGroup users={(task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }))} max={3} size={20} />
                  {task.dueDate && (
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
