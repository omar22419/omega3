import { useParams, useNavigate } from "react-router";
import { Eye, Archive, ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useTaskByIdQuery } from "@/hooks/queries";
import { useWatchTaskMutation, useAchievedTaskMutation } from "@/hooks/mutations/use-task-mutations";
import { useAuth } from "@/providers/auth-provider";
import { Loader } from "@/components/common/loader";
import { TaskTitle } from "@/components/task/task-detail/task-title";
import { TaskDescription } from "@/components/task/task-detail/task-description";
import { TaskStatusSelector } from "@/components/task/task-detail/task-status-selector";
import { TaskPrioritySelector } from "@/components/task/task-detail/task-priority-selector";
import { TaskAssigneesSelector } from "@/components/task/task-detail/task-assignees-selector";
import { SubTasksDetails } from "@/components/task/task-detail/sub-tasks";
import { CommentSection } from "@/components/task/task-detail/comment-section";
import { TaskActivity } from "@/components/task/task-detail/task-activity";
import { Watchers } from "@/components/task/task-detail/watchers";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { ProjectMember, User } from "@/types";

const SECTION = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)] font-medium mb-3";
const DIVIDER = "border-t border-[var(--border-color)] my-5";

export default function TaskDetails() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useTaskByIdQuery(taskId ?? "");
  const { mutate: watchTask,  isPending: isWatching  } = useWatchTaskMutation();
  const { mutate: achieveTask,isPending: isArchiving } = useAchievedTaskMutation();

  const task    = data?.data?.task;
  const project = data?.data?.project ?? task?.project;

  if (isLoading) return <Loader size="md" className="h-64" />;
  if (!task) return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>
      <p className="text-[var(--text-secondary)]">Task not found.</p>
    </div>
  );

  const watchers: User[] = (task.watchers ?? []) as User[];
  const isWatching_ = watchers.some(w => w._id === user?._id);
  const projectMembers = (typeof project === "object" && project !== null && "members" in project)
    ? (project as { members: ProjectMember[] }).members : [];

  const handleWatch = () => {
    watchTask({ taskId: task._id }, {
      onSuccess: () => toast.success(isWatching_ ? "Stopped watching" : "Now watching"),
      onError: () => toast.error("Failed to update watch status"),
    });
  };

  const handleArchive = () => {
    achieveTask({ taskId: task._id }, {
      onSuccess: () => toast.success(task.isAchieved ? "Task unarchived" : "Task archived"),
      onError: () => toast.error("Failed to archive task"),
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto">
      {/* Back */}
      <div className="px-6 pt-6 pb-0">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors">
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-color)]">

        {/* LEFT — main content */}
        <div className="lg:col-span-2 p-6 space-y-5">
          <TaskTitle title={task.title} taskId={task._id} />

          {/* Action row */}
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusSelector   status={task.status}   taskId={task._id} />
            <TaskPrioritySelector priority={task.priority} taskId={task._id} />
            <div className="ml-auto flex gap-2">
              <Button
                variant={isWatching_ ? "primary" : "secondary"}
                size="sm"
                onClick={handleWatch}
                disabled={isWatching}
              >
                <Eye size={14} />{isWatching_ ? "Watching" : "Watch"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleArchive}
                disabled={isArchiving}
              >
                <Archive size={14} />{task.isAchieved ? "Unarchive" : "Archive"}
              </Button>
            </div>
          </div>

          <div className={DIVIDER} />

          {/* Description */}
          <div>
            <p className={SECTION}>Description</p>
            <TaskDescription description={task.description} taskId={task._id} />
          </div>

          <div className={DIVIDER} />

          {/* Subtasks */}
          <div>
            <p className={SECTION}>
              Subtasks
              {task.subtasks && task.subtasks.length > 0 && (
                <span className="ml-2 font-normal normal-case text-[var(--text-tertiary)]">
                  {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                </span>
              )}
            </p>
            <SubTasksDetails subTasks={task.subtasks ?? []} taskId={task._id} />
          </div>

          <div className={DIVIDER} />

          {/* Comments */}
          <div>
            <p className={SECTION}>Comments</p>
            <CommentSection taskId={task._id} />
          </div>
        </div>

        {/* RIGHT — meta panel */}
        <div className="lg:col-span-1 p-6 space-y-5" aria-label="Task details">

          {/* Assignees */}
          <div>
            <p className={SECTION}>Assignees</p>
            <TaskAssigneesSelector
              task={task}
              assignees={task.assignees ?? []}
              projectMembers={projectMembers}
            />
          </div>

          <div className={DIVIDER} />

          {/* Due date */}
          {task.dueDate && (
            <>
              <div>
                <p className={SECTION}>Due Date</p>
                <div className="flex items-center gap-2 text-[13px] text-[var(--text-primary)]">
                  <Calendar size={14} className="text-[var(--text-secondary)]" />
                  <time dateTime={new Date(task.dueDate).toISOString()}>{formatDate(task.dueDate)}</time>
                </div>
              </div>
              <div className={DIVIDER} />
            </>
          )}

          {/* Watchers */}
          <div>
            <p className={SECTION}>Watchers</p>
            <Watchers watchers={watchers} />
          </div>

          <div className={DIVIDER} />

          {/* Activity */}
          <div>
            <p className={SECTION}>Activity</p>
            <TaskActivity taskId={task._id} />
          </div>
        </div>
      </div>
    </div>
  );
}
