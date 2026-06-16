import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { TaskTrendsData } from "@/types";

const TT = { backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 6, fontSize: 12, color: "var(--text-primary)" };

export function TaskTrendsChart({ data }: { data: TaskTrendsData[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#52525E" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#52525E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={TT} />
        <Area type="monotone" dataKey="completed"  name="Completed"   stroke="#10B981" fill="url(#gc)" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Area type="monotone" dataKey="inProgress" name="In Progress" stroke="#3B82F6" fill="url(#gp)" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Area type="monotone" dataKey="todo"       name="To Do"       stroke="#52525E" fill="url(#gt)" strokeWidth={2} dot={false} isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
