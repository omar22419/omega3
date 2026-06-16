import { cn } from "@/lib/utils";

type AvatarSize = "xs" | "sm" | "md" | "lg";

const SIZE: Record<AvatarSize, { cls: string; text: string }> = {
  xs: { cls: "w-5 h-5 rounded",     text: "text-[9px]"  },
  sm: { cls: "w-6 h-6 rounded-[4px]", text: "text-[10px]" },
  md: { cls: "w-8 h-8 rounded-[6px]", text: "text-[12px]" },
  lg: { cls: "w-12 h-12 rounded-[8px]",text: "text-[16px]" },
};

interface Props { name: string; color?: string; size?: AvatarSize; className?: string; }

export function WorkspaceAvatar({ name, color = "#6366F1", size = "sm", className }: Props) {
  const { cls, text } = SIZE[size];
  return (
    <div
      className={cn("flex items-center justify-center shrink-0 font-semibold text-white select-none", cls, className)}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <span className={text}>{name?.charAt(0)?.toUpperCase() ?? "W"}</span>
    </div>
  );
}
