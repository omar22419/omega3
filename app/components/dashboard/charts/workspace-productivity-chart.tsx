import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { WorkspaceProductivityData } from "@/types";

const TT = { backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 6, fontSize: 12, color: "var(--text-primary)" };

export function WorkspaceProductivityChart({ data }: { data: WorkspaceProductivityData[] }) {
  const hasData = data.some(d => d.total > 0);
  if (!hasData) return (
    <div className="flex items-center justify-center h-[200px] text-[13px] text-[var(--text-tertiary)]">
      No data yet
    </div>
  );
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={3} barSize={14}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={TT} />
        <Bar dataKey="total"     name="Total"     fill="var(--bg-selected)" radius={[3,3,0,0]} isAnimationActive={false} />
        <Bar dataKey="completed" name="Completed" fill="var(--brand)"       radius={[3,3,0,0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}
