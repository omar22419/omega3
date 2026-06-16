import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type {
  LoginPayload,
  RegisterPayload,
} from "@/lib/api/auth";

export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      authApi.verifyEmail(data),
  });
}

export function useResendVerifyEmailMutation() {
  return useMutation({
    mutationFn: (data: { email: string }) => authApi.resendVerifyEmail(data),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: { email: string }) => authApi.forgotPassword(data),
  });
}

export function useVerifyForgotPasswordCodeMutation() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      authApi.verifyForgotPasswordCode(data),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      newPassword: string;
      confirmPassword: string;
    }) => authApi.resetPassword(data),
  });
}
