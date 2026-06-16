import type { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Eye } from "lucide-react";

export function Watchers({ watchers }: { watchers: User[] }) {
  if (watchers.length === 0) {
    return (
      <p className="text-[13px] text-[var(--text-tertiary)] flex items-center gap-1.5">
        <Eye size={14} aria-hidden="true" /> No watchers
      </p>
    );
  }
  return (
    <div className="space-y-2">
      {watchers.map(w => (
        <div key={w._id} className="flex items-center gap-2">
          <Avatar style={{ width: 24, height: 24 }}>
            <AvatarImage src={w.profilePicture} />
            <AvatarFallback style={{ fontSize: 9, background: "var(--brand)", color: "#fff" }}>
              {getInitials(w.username)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[13px] text-[var(--text-secondary)]">{w.username}</span>
        </div>
      ))}
    </div>
  );
}
