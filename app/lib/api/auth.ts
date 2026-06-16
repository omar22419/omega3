import { post, patch } from "./client";
import type { ApiResponse, User } from "@/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userData: User;
}

export interface RegisterPayload {
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const authApi = {
  login: (data: LoginPayload) =>
    post<ApiResponse<LoginResponse>>("/auth/login", data),

  register: (data: RegisterPayload) =>
    post<ApiResponse<unknown>>("/auth/register", data),

  verifyEmail: (data: { email: string; otp: string }) =>
    patch<ApiResponse<unknown>>("/auth/verifyEmail", data),

  resendVerifyEmail: (data: { email: string }) =>
    patch<ApiResponse<unknown>>("/auth/resend-confirm-email", data),

  forgotPassword: (data: { email: string }) =>
    post<ApiResponse<unknown>>("/auth/reset-password", data),

  verifyForgotPasswordCode: (data: { email: string; otp: string }) =>
    patch<ApiResponse<unknown>>("/auth/verify-forgot-password-code", data),

  resetPassword: (data: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }) => patch<ApiResponse<unknown>>("/auth/reset-forgot-password-code", data),
};
