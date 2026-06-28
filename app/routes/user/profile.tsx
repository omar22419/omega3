import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link } from "react-router";
import { ArrowLeft, Camera, Loader2, Moon, Sun } from "lucide-react";
import { profileSchema, changePasswordSchema, type ProfileFormData, type ChangePasswordFormData } from "@/lib/schemas";
import {
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useUploadAvatarMutation,
} from "@/hooks/mutations/use-user-mutations";
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

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — matches backend limit

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { data, isLoading } = useUserProfileQuery();
  const profile = data?.data ?? user;

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUserProfileMutation();
  const { mutate: changePassword, isPending: isChangingPwd } = useChangePasswordMutation();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatarMutation();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke any object URL we created, on unmount or when replaced
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: { name: profile?.username ?? "" },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onProfileSubmit = (values: ProfileFormData) => {
    updateProfile(
      // Always re-send the current profilePicture — the backend
      // overwrites the field unconditionally, so omitting it here
      // would wipe out the user's avatar on every name update.
      { name: values.name, profilePicture: profile?.profilePicture },
      {
        onSuccess: () => {
          updateUser({ username: values.name });
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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WEBP, or GIF images are allowed");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    // Instant local preview while the upload is in flight
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const localUrl = URL.createObjectURL(file);
    objectUrlRef.current = localUrl;
    setPreviewUrl(localUrl);

    uploadAvatar(file, {
      onSuccess: (res) => {
        updateUser({ profilePicture: res.data.profilePicture });
        toast.success("Profile picture updated");
        setPreviewUrl(null);
      },
      onError: (err: unknown) => {
        setPreviewUrl(null);
        toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to upload image");
      },
    });
  };

  const avatarSrc = previewUrl ?? profile?.profilePicture;

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
              {/* Avatar + upload trigger */}
              <div className="relative shrink-0">
                <Avatar style={{ width: 64, height: 64 }}>
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback style={{ fontSize: 20, background: "var(--brand)", color: "#fff" }}>
                    {profile ? getInitials(profile.username) : "U"}
                  </AvatarFallback>
                </Avatar>

                {isUploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 size={18} className="animate-spin text-white" aria-hidden="true" />
                  </div>
                )}

                <label
                  htmlFor="avatar-upload"
                  aria-label="Change profile picture"
                  className="absolute -bottom-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full cursor-pointer transition-transform hover:scale-110"
                  style={{ background: "var(--brand)", border: "2px solid var(--bg-secondary)" }}
                >
                  <Camera size={12} className="text-white" aria-hidden="true" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept={ALLOWED_TYPES.join(",")}
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                  className="sr-only"
                />
              </div>

              <div>
                <p className="text-[18px] font-semibold text-[var(--text-primary)] mb-0.5">{profile?.username}</p>
                <p className="text-[13px] text-[var(--text-secondary)]">{profile?.email}</p>
                <p className="text-[11px] text-[var(--text-tertiary)] mt-1">JPEG, PNG, WEBP or GIF — up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Profile form — name only now */}
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
              <Button type="submit" variant="primary" size="sm" disabled={isUpdating}>
                {isUpdating ? "Saving…" : "Save Changes"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Password form — unchanged */}
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

        {/* Session — unchanged */}
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