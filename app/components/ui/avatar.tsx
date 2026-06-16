import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn, getInitials } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("flex h-full w-full items-center justify-center rounded-full font-medium", className)}
      {...props}
    />
  );
}

// ── AvatarGroup ───────────────────────────────────────────────────────────

interface AvatarGroupUser { name: string; avatar?: string; }
interface AvatarGroupProps { users: AvatarGroupUser[]; max?: number; size?: number; }

function AvatarGroup({ users, max = 3, size = 24 }: AvatarGroupProps) {
  const visible  = users.slice(0, max);
  const overflow = users.length - max;
  const ring     = "2px solid var(--bg-secondary)";
  const fs       = Math.floor(size * 0.38);

  return (
    <div className="flex -space-x-1.5" aria-label={`${users.length} members`}>
      {visible.map((u, i) => (
        <div
          key={i}
          aria-label={u.name}
          title={u.name}
          style={{
            width: size, height: size, borderRadius: "50%",
            zIndex: visible.length - i, outline: ring, overflow: "hidden",
            flexShrink: 0, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: fs, fontWeight: 500,
            background: u.avatar ? "transparent" : "var(--brand)", color: "#fff",
          }}
        >
          {u.avatar
            ? <img src={u.avatar} alt={u.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : getInitials(u.name)
          }
        </div>
      ))}
      {overflow > 0 && (
        <div
          aria-label={`${overflow} more`}
          style={{
            width: size, height: size, borderRadius: "50%", outline: ring,
            flexShrink: 0, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: fs,
            background: "var(--bg-hover)", color: "var(--text-secondary)",
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
