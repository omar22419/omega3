import { apiClient, get, patch } from "./client";
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

  // FIX: backend route is PATCH /user/updateProfile (was PUT /user/profile — always 404'd)
  updateProfile: (data: UpdateProfilePayload) =>
    patch<ApiResponse<User>>("/user/updateProfile", data),

  // FIX: backend route is PATCH /user/change-password (was PUT — also always 404'd)
  changePassword: (data: ChangePasswordPayload) =>
    patch<ApiResponse<unknown>>("/user/change-password", data),

  // NEW: uploads an image file to Cloudinary via the backend
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return apiClient
      .post<ApiResponse<User>>("/user/profile/avatar", formData, {
        // Must clear the instance's default JSON Content-Type so the
        // browser sets its own multipart boundary — DO NOT remove this line.
        headers: { "Content-Type": undefined },
      })
      .then((res) => res.data);
  },
};