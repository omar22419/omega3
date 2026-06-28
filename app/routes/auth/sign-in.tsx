import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signInSchema, type SignInFormData } from "@/lib/schemas";
import { useLoginMutation } from "@/hooks/mutations/use-auth-mutations";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { mutate, isPending } = useLoginMutation();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: SignInFormData) => {
    mutate(values, {
      onSuccess: (res) => {
        login(res as { data: { token: string; userData: import("@/types").User } });
        toast.success("Welcome back!");
        navigate("/dashboard", { replace: true });
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { errorMessage?: string } } })?.response?.data?.errorMessage ?? "Invalid credentials";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold mb-1">Sign in to your account</h1>
        <p className="text-[13px] text-[var(--text-secondary)]">Welcome back! Please enter your details.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Email</FormLabel>
              <FormControl><Input {...field} type="email" placeholder="you@example.com" autoComplete="email" /></FormControl>
              <FormMessage className="text-[11px] text-[var(--priority-high)]" />
            </FormItem>
          )} />

          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Password</FormLabel>
                <Link to="/forgot-password" className="text-[12px] text-[var(--brand)] hover:text-[var(--brand-hover)]">Forgot password?</Link>
              </div>
              <FormControl><Input {...field} type="password" placeholder="••••••••" autoComplete="current-password" /></FormControl>
              <FormMessage className="text-[11px] text-[var(--priority-high)]" />
            </FormItem>
          )} />

          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-[13px] text-[var(--text-secondary)]">
        Don't have an account?{" "}
        <Link to="/sign-up" className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium">Sign up</Link>
      </p>
    </div>
  );
}
