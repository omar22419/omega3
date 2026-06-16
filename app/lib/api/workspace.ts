import { get, post } from "./client";
import type { ApiResponse, Project, Workspace } from "@/types";

export interface CreateWorkspacePayload {
  name: string;
  color: string;
  description?: string;
}

export interface InviteMemberPayload {
  workspaceId: string;
  email: string;
  role: string;
}

export const workspaceApi = {
  getAll: () => get<ApiResponse<Workspace[]>>("/workspace"),

  getById: (id: string) => get<ApiResponse<Workspace>>(`/workspace/${id}`),

  getWithProjects: (id: string) =>
    get<ApiResponse<{ workspace: Workspace; projects: Project[] }>>(
      `/workspace/${id}/projects`
    ),

  getStats: (id: string) => get<ApiResponse<unknown>>(`/workspace/${id}/stats`),

  create: (data: CreateWorkspacePayload) =>
    post<ApiResponse<Workspace>>("/workspace", data),

  inviteMember: (data: InviteMemberPayload) =>
    post<ApiResponse<unknown>>(
      `/workspace/${data.workspaceId}/invite-member`,
      data
    ),

  acceptInviteByToken: (token: string) =>
    post<ApiResponse<unknown>>("/workspace/accept-invite-token", { token }),

  acceptGenerateInvite: (workspaceId: string) =>
    post<ApiResponse<unknown>>(
      `/workspace/${workspaceId}/accept-generate-invite`,
      {}
    ),
};
