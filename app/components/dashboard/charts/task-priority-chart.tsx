import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { TaskPriorityData } from "@/types";

const TT = { backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 6, fontSize: 12, color: "var(--text-primary)" };

export function TaskPriorityChart({ data }: { data: TaskPriorityData[] }) {
  const hasData = data.some(d => d.value > 0);
  if (!hasData) return (
    <div className="flex items-center justify-center h-[200px] text-[13px] text-[var(--text-tertiary)]">
      No tasks yet
    </div>
  );
  return (
    <>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={2} dataKey="value" isAnimationActive={false}>
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Tooltip contentStyle={TT} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map(item => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
            <span className="text-[11px] text-[var(--text-secondary)]">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </>
  );
}
