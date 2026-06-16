import { get, post, put } from "./client";
import type { ActivityLog, ApiResponse, Comment, Task } from "@/types";
import type { TaskPriority, TaskStatus } from "@/types";

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assignees: string[];
}

export const taskApi = {
  create: (projectId: string, data: CreateTaskPayload) =>
    post<ApiResponse<Task>>(`/task/${projectId}/create-task`, data),

  getById: (taskId: string) =>
    get<ApiResponse<{ task: Task; project: Task["project"] }>>(
      `/task/${taskId}`
    ),

  getMyTasks: () => get<ApiResponse<Task[]>>("/task/my-tasks"),

  updateTitle: (taskId: string, title: string) =>
    put<ApiResponse<Task>>(`/task/${taskId}/title`, { title }),

  updateStatus: (taskId: string, status: TaskStatus) =>
    put<ApiResponse<Task>>(`/task/${taskId}/status`, { status }),

  updateDescription: (taskId: string, description: string) =>
    put<ApiResponse<Task>>(`/task/${taskId}/description`, { description }),

  updateAssignees: (taskId: string, assignees: string[]) =>
    put<ApiResponse<Task>>(`/task/${taskId}/assignees`, { assignees }),

  updatePriority: (taskId: string, priority: TaskPriority) =>
    put<ApiResponse<Task>>(`/task/${taskId}/priority`, { priority }),

  addSubtask: (taskId: string, title: string) =>
    post<ApiResponse<Task>>(`/task/${taskId}/add-subtask`, { title }),

  updateSubtask: (
    taskId: string,
    subTaskId: string,
    completed: boolean
  ) =>
    put<ApiResponse<Task>>(
      `/task/${taskId}/update-subtask/${subTaskId}`,
      { completed }
    ),

  addComment: (taskId: string, text: string) =>
    post<ApiResponse<Comment>>(`/task/${taskId}/add-comment`, { text }),

  getComments: (taskId: string) =>
    get<ApiResponse<Comment[]>>(`/task/${taskId}/comments`),

  getActivity: (taskId: string) =>
    get<ApiResponse<ActivityLog[]>>(`/task/${taskId}/activity`),

  watchTask: (taskId: string) =>
    post<ApiResponse<Task>>(`/task/${taskId}/watch`, {}),

  achieveTask: (taskId: string) =>
    post<ApiResponse<Task>>(`/task/${taskId}/achieved`, {}),
};
