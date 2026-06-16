import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { useVerifyEmailMutation, useResendVerifyEmailMutation } from "@/hooks/mutations/use-auth-mutations";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState("");

  const { mutate: verify,  isPending        } = useVerifyEmailMutation();
  const { mutate: resend,  isPending: isSending } = useResendVerifyEmailMutation();

  const handleVerify = () => {
    if (!otp.trim()) return;
    verify({ email, otp }, {
      onSuccess: () => { toast.success("Email verified — you can now sign in."); navigate("/sign-in", { replace: true }); },
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid code"),
    });
  };

  const handleResend = () => {
    resend({ email }, {
      onSuccess: () => toast.success("New code sent."),
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to resend"),
    });
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-[10px] flex items-center justify-center" style={{ background: "var(--brand-light)" }}>
          <MailCheck size={24} style={{ color: "var(--brand)" }} />
        </div>
        <div>
          <h1 className="text-[22px] font-semibold mb-1">Check your email</h1>
          <p className="text-[13px] text-[var(--text-secondary)]">
            We sent a verification code to <span className="font-medium text-[var(--text-primary)]">{email}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3 text-left">
        <label className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]" htmlFor="otp">
          Verification code
        </label>
        <input
          id="otp"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={e => setOtp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleVerify()}
          maxLength={6}
          className="w-full h-10 px-3 rounded-[4px] border border-[var(--border-color)] text-center text-[18px] tracking-[0.3em] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
          style={{ background: "var(--bg-secondary)" }}
        />
        <Button variant="primary" className="w-full" onClick={handleVerify} disabled={isPending || !otp.trim()}>
          {isPending ? "Verifying…" : "Verify email"}
        </Button>
      </div>

      <p className="text-[13px] text-[var(--text-secondary)]">
        Didn't receive the code?{" "}
        <button onClick={handleResend} disabled={isSending}
          className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium disabled:opacity-50">
          {isSending ? "Sending…" : "Resend"}
        </button>
      </p>
    </div>
  );
}
