import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas";
import { useForgotPasswordMutation } from "@/hooks/mutations/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { mutate, isPending } = useForgotPasswordMutation();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Reset code sent — check your inbox.");
        navigate(`/reset-password?email=${encodeURIComponent(values.email)}`, { replace: true });
      },
      onError: (err: unknown) => toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed"),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-semibold mb-1">Reset password</h1>
        <p className="text-[13px] text-[var(--text-secondary)]">Enter your email and we'll send you a reset code.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Email</FormLabel>
              <FormControl><Input {...field} type="email" placeholder="you@example.com" autoFocus autoComplete="email" /></FormControl>
              <FormMessage className="text-[11px] text-[var(--priority-high)]" />
            </FormItem>
          )} />
          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? "Sending…" : "Send reset code"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-[13px] text-[var(--text-secondary)]">
        <Link to="/sign-in" className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
