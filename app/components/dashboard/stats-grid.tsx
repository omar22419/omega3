import { FolderKanban, CheckSquare, Clock, TrendingUp } from "lucide-react";
import { StatCard } from "./stat-card";
import { SkeletonStatCard } from "@/components/ui/skeleton";
import type { StatsCardProps } from "@/types";

interface Props { data?: StatsCardProps; isLoading?: boolean; }

export function StatsGrid({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <SkeletonStatCard key={i} />)}
      </div>
    );
  }
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Projects"
        value={data.totalProjects}
        sub={`${data.totalProjectInProgress} in progress`}
        icon={FolderKanban}
        accentColor="var(--brand)"
      />
      <StatCard
        label="Total Tasks"
        value={data.totalTasks}
        sub={`${data.totalTaskCompleted} completed`}
        icon={CheckSquare}
        accentColor="var(--status-done)"
      />
      <StatCard
        label="In Progress"
        value={data.totalTaskInProgress}
        sub="Currently active"
        icon={Clock}
        accentColor="var(--status-progress)"
      />
      <StatCard
        label="Completed"
        value={data.totalTaskCompleted}
        sub={data.totalTasks ? `${Math.round((data.totalTaskCompleted / data.totalTasks) * 100)}% completion rate` : "No tasks yet"}
        icon={TrendingUp}
        accentColor="var(--status-done)"
      />
    </div>
  );
}
