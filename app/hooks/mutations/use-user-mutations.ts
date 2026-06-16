import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api/user";
import type { UpdateProfilePayload, ChangePasswordPayload } from "@/lib/api/user";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateUserProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => userApi.updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: ChangePasswordPayload) => userApi.changePassword(data),
  });
}
