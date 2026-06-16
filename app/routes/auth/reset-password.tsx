import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/schemas";
import { useVerifyForgotPasswordCodeMutation, useResetPasswordMutation } from "@/hooks/mutations/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email") ?? "";
  const [step, setStep] = useState<"otp" | "password">("otp");
  const [otp, setOtp] = useState("");

  const { mutate: verifyCode, isPending: isVerifying } = useVerifyForgotPasswordCodeMutation();
  const { mutate: resetPwd,   isPending: isResetting  } = useResetPasswordMutation();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const handleVerifyOtp = () => {
    if (!otp.trim()) return;
    verifyCode({ email, otp }, {
      onSuccess: () => { toast.success("Code verified"); setStep("password"); },
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid code"),
    });
  };

  const onSubmit = (values: ResetPasswordFormData) => {
    resetPwd({ email, otp, ...values }, {
      onSuccess: () => { toast.success("Password reset — please sign in."); navigate("/sign-in", { replace: true }); },
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Reset failed"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold mb-1">
          {step === "otp" ? "Enter reset code" : "Create new password"}
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)]">
          {step === "otp" ? `Code sent to ${email}` : "Choose a strong password."}
        </p>
      </div>

      {step === "otp" ? (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]" htmlFor="reset-otp">Reset code</label>
            <input
              id="reset-otp"
              placeholder="6-digit code"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
              maxLength={6}
              className="w-full h-10 px-3 rounded-[4px] border border-[var(--border-color)] text-center text-[18px] tracking-[0.3em] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
              style={{ background: "var(--bg-secondary)" }}
            />
          </div>
          <Button variant="primary" className="w-full" onClick={handleVerifyOtp} disabled={isVerifying || !otp.trim()}>
            {isVerifying ? "Verifying…" : "Verify code"}
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="newPassword" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">New password</FormLabel>
                <FormControl><Input {...field} type="password" placeholder="••••••••" autoFocus autoComplete="new-password" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Confirm password</FormLabel>
                <FormControl><Input {...field} type="password" placeholder="••••••••" autoComplete="new-password" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />
            <Button type="submit" variant="primary" className="w-full" disabled={isResetting}>
              {isResetting ? "Resetting…" : "Reset password"}
            </Button>
          </form>
        </Form>
      )}

      <p className="text-center text-[13px] text-[var(--text-secondary)]">
        <Link to="/sign-in" className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
