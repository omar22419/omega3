import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceApi, type CreateWorkspacePayload } from "@/lib/api/workspace";
import { queryKeys } from "@/lib/query-keys";

export function useCreateWorkspaceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspacePayload) => workspaceApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaces.all() });
    },
  });
}

export function useInviteMemberMutation() {
  return useMutation({
    mutationFn: (data: { workspaceId: string; email: string; role: string }) =>
      workspaceApi.inviteMember(data),
  });
}

export function useAcceptInviteByTokenMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => workspaceApi.acceptInviteByToken(token),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaces.all() });
    },
  });
}

export function useAcceptGenerateInviteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceApi.acceptGenerateInvite(workspaceId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.workspaces.all() });
    },
  });
}
