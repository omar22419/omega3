import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number;
  sub: string;
  icon: LucideIcon;
  accentColor?: string;
}

export function StatCard({ label, value, sub, icon: Icon, accentColor = "var(--brand)" }: Props) {
  return (
    <div
      className="rounded-[8px] border border-[var(--border-color)] p-5"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)] font-medium">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-[6px] flex items-center justify-center"
          style={{ background: `${accentColor}18` }}
          aria-hidden="true"
        >
          <Icon size={16} style={{ color: accentColor }} />
        </div>
      </div>
      <div className="text-[28px] font-semibold text-[var(--text-primary)] tabular-nums mb-1">
        {value}
      </div>
      <p className="text-[12px] text-[var(--text-secondary)]">{sub}</p>
    </div>
  );
}
