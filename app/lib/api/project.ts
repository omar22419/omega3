import { get, post } from "./client";
import type { ApiResponse, Project, Task } from "@/types";

export interface CreateProjectPayload {
  title: string;
  description?: string;
  status: string;
  startDate: string;
  dueDate: string;
  members?: { user: string; role: string }[];
  tags?: string;
}

export const projectApi = {
  create: (workspaceId: string, data: CreateProjectPayload) =>
    post<ApiResponse<Project>>(
      `/project/${workspaceId}/create-project`,
      data
    ),

  getWithTasks: (projectId: string) =>
    get<ApiResponse<{ project: Project; tasks: Task[] }>>(
      `/project/${projectId}/tasks`
    ),
};
