import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signUpSchema, type SignUpFormData } from "@/lib/schemas";
import { useSignUpMutation } from "@/hooks/mutations/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function SignUp() {
  const navigate = useNavigate();
  const { mutate, isPending } = useSignUpMutation();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", username: "", phone: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: SignUpFormData) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("Account created — verify your email.");
        navigate(`/verify-email?email=${encodeURIComponent(values.email)}`, { replace: true });
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { errorMessage?: string } } })?.response?.data?.errorMessage ?? "Registration failed";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-semibold mb-1">Create your account</h1>
        <p className="text-[13px] text-[var(--text-secondary)]">Get started with Omega3 for free.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "email" as const,    label: "Email",    type: "email",    placeholder: "you@example.com" },
            { name: "username" as const, label: "Username", type: "text",     placeholder: "yourname" },
            { name: "phone" as const,    label: "Phone",    type: "tel",      placeholder: "+20 1XX XXX XXXX" },
          ].map(f => (
            <FormField key={f.name} control={form.control} name={f.name} render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">{f.label}</FormLabel>
                <FormControl><Input {...field} type={f.type} placeholder={f.placeholder} /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />
          ))}

          <div className="grid grid-cols-2 gap-3">
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Password</FormLabel>
                <FormControl><Input {...field} type="password" placeholder="••••••••" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />
            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">Confirm</FormLabel>
                <FormControl><Input {...field} type="password" placeholder="••••••••" /></FormControl>
                <FormMessage className="text-[11px] text-[var(--priority-high)]" />
              </FormItem>
            )} />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isPending}>
            {isPending ? "Creating…" : "Create account"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-[13px] text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link to="/sign-in" className="text-[var(--brand)] hover:text-[var(--brand-hover)] font-medium">Sign in</Link>
      </p>
    </div>
  );
}
