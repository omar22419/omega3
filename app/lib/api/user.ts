import { get, put } from "./client";
import type { ApiResponse, User } from "@/types";

export interface UpdateProfilePayload {
  name: string;
  profilePicture?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userApi = {
  getProfile: () => get<ApiResponse<User>>("/user/profile"),

  updateProfile: (data: UpdateProfilePayload) =>
    put<ApiResponse<User>>("/user/profile", data),

  changePassword: (data: ChangePasswordPayload) =>
    put<ApiResponse<unknown>>("/user/change-password", data),
};
