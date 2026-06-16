import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { workspaceApi } from "@/lib/api/workspace";
import { projectApi } from "@/lib/api/project";
import { taskApi } from "@/lib/api/task";
import { userApi } from "@/lib/api/user";

// ─── Workspace ────────────────────────────────────────────────────────────────

export function useWorkspacesQuery() {
  return useQuery({
    queryKey: queryKeys.workspaces.all(),
    queryFn: () => workspaceApi.getAll(),
  });
}

/** Fetches /workspace/:id — returns Workspace with members (no projects). */
export function useWorkspaceDetailsQuery(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(workspaceId),
    queryFn: () => workspaceApi.getById(workspaceId),
    enabled: !!workspaceId,
  });
}

/** Fetches /workspace/:id/projects — returns { workspace, projects[] }. */
export function useWorkspaceWithProjectsQuery(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.withProjects(workspaceId),
    queryFn: () => workspaceApi.getWithProjects(workspaceId),
    enabled: !!workspaceId,
  });
}

/** Fetches /workspace/:id/stats — returns full dashboard data object. */
export function useWorkspaceStatsQuery(workspaceId: string) {
  return useQuery({
    queryKey: queryKeys.workspaces.stats(workspaceId),
    queryFn: () => workspaceApi.getStats(workspaceId),
    enabled: !!workspaceId,
  });
}

// ─── Project ──────────────────────────────────────────────────────────────────

/** Fetches /project/:id/tasks — returns { project, tasks[] }. */
export function useProjectWithTasksQuery(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.withTasks(projectId),
    queryFn: () => projectApi.getWithTasks(projectId),
    enabled: !!projectId,
  });
}

// ─── Task ─────────────────────────────────────────────────────────────────────

/** Fetches /task/:id — returns { task, project }. */
export function useTaskByIdQuery(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId),
    queryFn: () => taskApi.getById(taskId),
    enabled: !!taskId,
  });
}

/** Fetches /task/my-tasks — returns Task[]. */
export function useMyTasksQuery() {
  return useQuery({
    queryKey: queryKeys.tasks.mine(),
    queryFn: () => taskApi.getMyTasks(),
  });
}

/** Fetches /task/:id/comments — returns Comment[]. */
export function useTaskCommentsQuery(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.comments(taskId),
    queryFn: () => taskApi.getComments(taskId),
    enabled: !!taskId,
  });
}

/** Fetches /task/:id/activity — returns ActivityLog[]. */
export function useTaskActivityQuery(taskId: string) {
  return useQuery({
    queryKey: queryKeys.tasks.activity(taskId),
    queryFn: () => taskApi.getActivity(taskId),
    enabled: !!taskId,
  });
}

// ─── User ─────────────────────────────────────────────────────────────────────

/** Fetches /user/profile — returns User. */
export function useUserProfileQuery() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => userApi.getProfile(),
  });
}
