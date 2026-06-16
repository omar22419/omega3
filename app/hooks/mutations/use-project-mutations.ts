import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectApi, type CreateProjectPayload } from "@/lib/api/project";
import { queryKeys } from "@/lib/query-keys";

export function useCreateProjectMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: string;
      data: CreateProjectPayload;
    }) => projectApi.create(workspaceId, data),
    onSuccess: (_res, variables) => {
      qc.invalidateQueries({
        queryKey: queryKeys.workspaces.withProjects(variables.workspaceId),
      });
      qc.invalidateQueries({
        queryKey: queryKeys.workspaces.stats(variables.workspaceId),
      });
    },
  });
}
