import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from "@/lib/schemas";
import { useUpdateUserProfileMutation, useChangePasswordMutation } from "@/hooks/mutations/use-user-mutations";
import { useUserProfileQuery } from "@/hooks/queries";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

const LABEL = "text-[11px] uppercase tracking-wide text-[var(--text-secondary)] font-medium";
const SECTION_TITLE = "text-[13px] font-semibold text-[var(--text-primary)] mb-4 pb-3 border-b border-[var(--border-color)]";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data, isLoading } = useUserProfileQuery();
  const profile = data?.data ?? user;

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUserProfileMutation();
  const { mutate: changePassword, isPending: isChangingPwd } = useChangePasswordMutation();

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.username ?? "", profilePicture: profile?.profilePicture ?? "" },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onProfileSubmit = (values: ProfileFormData) => {
    updateProfile(
      { name: values.name, profilePicture: values.profilePicture },
      {
        onSuccess: () => {
          updateUser({ username: values.name, profilePicture: values.profilePicture });
          toast.success("Profile updated");
        },
        onError: (err: unknown) => {
          toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Update failed");
        },
      }
    );
  };

  const onPasswordSubmit = (values: ChangePasswordFormData) => {
    changePassword(values, {
      onSuccess: () => {
        toast.success("Password changed — please sign in again.");
        passwordForm.reset();
        logout();
      },
      onError: (err: unknown) => {
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to change password");
      },
    });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-2xl mx-auto p-6 md:p-10">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-[6px] border border-[var(--border-color)] text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            {theme === "dark" ? <><Sun size={14} /> Light mode</> : <><Moon size={14} /> Dark mode</>}
          </button>
        </div>

        {/* Avatar block */}
        <div className="rounded-[12px] border border-[var(--border-color)] p-6 mb-6" style={{ background: "var(--bg-secondary)" }}>
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-3 w-52" /></div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Avatar style={{ width: 64, height: 64 }}>
                <AvatarImage src={profile?.profilePicture} />
                <AvatarFallback style={{ fontSize: 20, background: "var(--brand)", color: "#fff" }}>
                  {profile ? getInitials(profile.username) : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[18px] font-semibold text-[var(--text-primary)] mb-0.5">{profile?.username}</p>
                <p className="text-[13px] text-[var(--text-secondary)]">{profile?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile form */}
        <div className="rounded-[12px] border border-[var(--border-color)] p-6 mb-6" style={{ background: "var(--bg-secondary)" }}>
          <h2 className={SECTION_TITLE}>Profile Information</h2>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField control={profileForm.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Display Name</FormLabel>
                  <FormControl><Input {...field} placeholder="Your name" /></FormControl>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />
              <FormField control={profileForm.control} name="profilePicture" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Avatar URL <span className="normal-case text-[var(--text-tertiary)]">(optional)</span></FormLabel>
                  <FormControl><Input {...field} type="url" placeholder="https://example.com/avatar.jpg" /></FormControl>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />
              <Button type="submit" variant="primary" size="sm" disabled={isUpdating}>
                {isUpdating ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Password form */}
        <div className="rounded-[12px] border border-[var(--border-color)] p-6 mb-6" style={{ background: "var(--bg-secondary)" }}>
          <h2 className={SECTION_TITLE}>Change Password</h2>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel className={LABEL}>Current Password</FormLabel>
                  <FormControl><Input {...field} type="password" placeholder="••••••••" autoComplete="current-password" /></FormControl>
                  <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>New Password</FormLabel>
                    <FormControl><Input {...field} type="password" placeholder="••••••••" autoComplete="new-password" /></FormControl>
                    <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                  </FormItem>
                )} />
                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={LABEL}>Confirm</FormLabel>
                    <FormControl><Input {...field} type="password" placeholder="••••••••" autoComplete="new-password" /></FormControl>
                    <FormMessage className="text-[11px] text-[var(--priority-high)]" />
                  </FormItem>
                )} />
              </div>
              <Button type="submit" variant="secondary" size="sm" disabled={isChangingPwd}>
                {isChangingPwd ? "Changing…" : "Change Password"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Session */}
        <div className="rounded-[12px] border border-[var(--border-color)] p-6" style={{ background: "var(--bg-secondary)" }}>
          <h2 className={SECTION_TITLE}>Session</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="text-[var(--priority-high)] hover:text-[var(--priority-high)]"
          >
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
