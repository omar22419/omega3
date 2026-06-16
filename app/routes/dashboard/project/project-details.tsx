import { useState } from "react";
import { useParams, Link } from "react-router";
import { Plus, ArrowLeft } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useProjectWithTasksQuery } from "@/hooks/queries";
import { useUpdateTaskStatusMutation } from "@/hooks/mutations/use-task-mutations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarGroup } from "@/components/ui/avatar";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { useNavigate } from "react-router";
import type { ProjectMember, Task, TaskStatus } from "@/types";

const TASK_TYPE = "task";

function TaskCard({ task, workspaceId, projectId }: { task: Task; workspaceId: string; projectId: string }) {
  const assigneeUsers = (task.assignees ?? []).map(a => ({ name: a.username, avatar: a.profilePicture }));

  const [{ isDragging }, drag] = useDrag({
    type: TASK_TYPE,
    item: { id: task._id, status: task.status },
    collect: m => ({ isDragging: m.isDragging() }),
  });

  return (
    <Link
      to={`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
      ref={drag as unknown as React.Ref<HTMLAnchorElement>}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="block"
    >
      <Card className="p-3 mb-2 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-[14px] flex-1 leading-snug">{task.title}</h3>
          <StatusBadge variant="priority" value={task.priority} />
        </div>
        {task.description && (
          <p className="text-[13px] text-[var(--text-secondary)] mb-3 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between">
          <AvatarGroup users={assigneeUsers} max={3} size={20} />
          {task.dueDate && (
            <span className="text-[11px] text-[var(--text-secondary)]">
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "To Do",       label: "To Do"       },
  { status: "In Progress", label: "In Progress"  },
  { status: "Done",        label: "Done"         },
];

function Column({ status, label, tasks, workspaceId, projectId, onStatusChange, onAddTask }: {
  status: TaskStatus; label: string; tasks: Task[];
  workspaceId: string; projectId: string;
  onStatusChange: (id: string, s: TaskStatus) => void;
  onAddTask: () => void;
}) {
  const [{ isOver }, drop] = useDrop({
    accept: TASK_TYPE,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status) onStatusChange(item.id, status);
    },
    collect: m => ({ isOver: m.isOver() }),
  });

  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className="flex-1 min-w-[280px]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-medium uppercase tracking-wide">{label}</h3>
          <span className="px-2 py-0.5 rounded-full bg-[var(--bg-hover)] text-[11px] text-[var(--text-secondary)]">
            {tasks.length}
          </span>
        </div>
        <Button variant="icon" size="icon" onClick={onAddTask} aria-label={`Add task to ${label}`}>
          <Plus size={14} />
        </Button>
      </div>
      <div className={`min-h-[400px] rounded-[8px] p-2 transition-colors border ${isOver ? "bg-[var(--brand-light)] border-[var(--brand)]" : "bg-[var(--bg-secondary)] border-[var(--border-color)]"}`}>
        {tasks.map(t => (
          <TaskCard key={t._id} task={t} workspaceId={workspaceId} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectDetails() {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const navigate = useNavigate();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("To Do");

  const { data, isLoading } = useProjectWithTasksQuery(projectId ?? "");
  const { mutate: updateStatus } = useUpdateTaskStatusMutation();

  const project = data?.data?.project;
  const tasks   = data?.data?.tasks ?? [];

  if (isLoading) {
    return (
      <div className="p-6 max-w-[1280px] mx-auto space-y-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-56" />
        <div className="flex gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-96 flex-1 min-w-[280px] rounded-[8px]" />)}
        </div>
      </div>
    );
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateStatus({ taskId, status });
  };

  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setCreateTaskOpen(true);
  };

  const totalTasks = tasks.length;
  const doneTasks  = tasks.filter(t => t.status === "Done").length;
  const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 md:p-6 max-w-[1280px] mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="flex-1">
              <h1 className="mb-1">{project?.title}</h1>
              <p className="text-[var(--text-secondary)]">{project?.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {project && <StatusBadge variant="status" value={project.status} />}
              <Button variant="primary" onClick={() => handleAddTask("To Do")}>
                <Plus size={16} /> New Task
              </Button>
            </div>
          </div>

          {totalTasks > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] mb-1">
                  <span>Progress</span><span>{progress}%</span>
                </div>
                <div className="h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand)] rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
              {project?.dueDate && (
                <span className="text-[13px] text-[var(--text-secondary)] shrink-0">
                  Due {new Date(project.dueDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Kanban */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map(col => (
            <Column
              key={col.status}
              status={col.status}
              label={col.label}
              tasks={tasks.filter(t => t.status === col.status)}
              workspaceId={workspaceId ?? ""}
              projectId={projectId ?? ""}
              onStatusChange={handleStatusChange}
              onAddTask={() => handleAddTask(col.status)}
            />
          ))}
        </div>

        <CreateTaskDialog
          open={createTaskOpen}
          onOpenChange={setCreateTaskOpen}
          projectId={projectId ?? ""}
          projectMembers={(project?.members ?? []) as ProjectMember[]}
        />
      </div>
    </DndProvider>
  );
}
