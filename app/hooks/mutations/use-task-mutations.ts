import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi, type CreateTaskPayload } from "@/lib/api/task";
import { queryKeys } from "@/lib/query-keys";
import type { TaskPriority, TaskStatus } from "@/types";

// FIX #2: Use variables.projectId for invalidation — not res.data.project,
// which may be a populated object rather than a string ID.
function invalidateTask(qc: ReturnType<typeof useQueryClient>, taskId: string) {
  qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(taskId) });
  qc.invalidateQueries({ queryKey: queryKeys.tasks.activity(taskId) });
}

export function useCreateTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: CreateTaskPayload;
    }) => taskApi.create(projectId, data),
    // Use variables.projectId — safe regardless of whether project is
    // returned as a string ID or populated object.
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.projects.withTasks(variables.projectId),
      });
    },
  });
}

export function useUpdateTaskTitleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      taskApi.updateTitle(taskId, title),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useUpdateTaskStatusMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      taskApi.updateStatus(taskId, status),
    onSuccess: (_res, vars) => {
      invalidateTask(qc, vars.taskId);
      // FIX #10: Invalidate my-tasks so list view reflects status change
      qc.invalidateQueries({ queryKey: queryKeys.tasks.mine() });
    },
  });
}

export function useUpdateTaskDescriptionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      description,
    }: {
      taskId: string;
      description: string;
    }) => taskApi.updateDescription(taskId, description),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useUpdateTaskAssigneesMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      assignees,
    }: {
      taskId: string;
      assignees: string[];
    }) => taskApi.updateAssignees(taskId, assignees),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useUpdateTaskPriorityMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      priority,
    }: {
      taskId: string;
      priority: TaskPriority;
    }) => taskApi.updatePriority(taskId, priority),
    onSuccess: (_res, vars) => {
      invalidateTask(qc, vars.taskId);
      // FIX #10: Invalidate my-tasks so list view reflects priority change
      qc.invalidateQueries({ queryKey: queryKeys.tasks.mine() });
    },
  });
}

export function useAddSubTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, title }: { taskId: string; title: string }) =>
      taskApi.addSubtask(taskId, title),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useUpdateSubTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      subTaskId,
      completed,
    }: {
      taskId: string;
      subTaskId: string;
      completed: boolean;
    }) => taskApi.updateSubtask(taskId, subTaskId, completed),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useAddCommentMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, text }: { taskId: string; text: string }) =>
      taskApi.addComment(taskId, text),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.comments(vars.taskId) });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.activity(vars.taskId) });
      qc.invalidateQueries({ queryKey: queryKeys.tasks.detail(vars.taskId) });
    },
  });
}

export function useWatchTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId }: { taskId: string }) => taskApi.watchTask(taskId),
    onSuccess: (_res, vars) => invalidateTask(qc, vars.taskId),
  });
}

export function useAchievedTaskMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId }: { taskId: string }) =>
      taskApi.achieveTask(taskId),
    onSuccess: (_res, vars) => {
      invalidateTask(qc, vars.taskId);
      qc.invalidateQueries({ queryKey: queryKeys.tasks.mine() });
    },
  });
}
