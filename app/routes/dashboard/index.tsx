import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { ArrowRight, CheckCircle2, Clock, FolderKanban, TrendingUp } from "lucide-react";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { useWorkspaceStatsQuery, useWorkspacesQuery } from "@/hooks/queries";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TaskTrendsChart } from "@/components/dashboard/charts/task-trends-chart";
import { ProjectStatusChart } from "@/components/dashboard/charts/project-status-chart";
import { TaskPriorityChart } from "@/components/dashboard/charts/task-priority-chart";
import { WorkspaceProductivityChart } from "@/components/dashboard/charts/workspace-productivity-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";
import { OnboardingPrompt } from "@/components/dashboard/onboarding-prompt";
import { CreateWorkspaceDialog } from "@/components/workspace/create-workspace-dialog";
import type {
  DashboardData, ProjectStatusData, TaskPriorityData,
  TaskTrendsData, WorkspaceProductivityData,
} from "@/types";

type DashResponse = DashboardData & {
  taskTrendsData: TaskTrendsData[];
  projectStatusData: ProjectStatusData[];
  taskPriorityData: TaskPriorityData[];
  workspaceProductivityData: WorkspaceProductivityData[];
};

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const { selectedWorkspaceId } = useWorkspaceContext();
  const workspaceId = searchParams.get("workspaceId") ?? selectedWorkspaceId;
  const [createOpen, setCreateOpen] = useState(false);

  const { data: wsListData, isLoading: wsListLoading } = useWorkspacesQuery();
  const { data: statsData, isLoading: statsLoading } = useWorkspaceStatsQuery(workspaceId ?? "");

  const workspaces = wsListData?.data ?? [];
  const noWorkspace = !wsListLoading && workspaces.length === 0;

  if (noWorkspace) {
    return (
      <>
        <OnboardingPrompt onCreateWorkspace={() => setCreateOpen(true)} />
        <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} />
      </>
    );
  }

  const dash = statsData?.data as DashResponse | undefined;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1280px] mx-auto">
      {/* Title */}
      <div>
        <h1 className="mb-1">Dashboard</h1>
        <p className="text-[var(--text-secondary)]">Track your projects and tasks at a glance</p>
      </div>

      {/* Stats */}
      <StatsGrid data={dash?.stats} isLoading={statsLoading} />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Trends */}
        <Card className="p-5">
          <h3 className="mb-4">Task Trends</h3>
          {statsLoading
            ? <Skeleton className="h-[200px] w-full rounded-[6px]" />
            : <TaskTrendsChart data={dash?.taskTrendsData ?? []} />
          }
        </Card>

        {/* Project Status */}
        <Card className="p-5">
          <h3 className="mb-4">Project Status</h3>
          {statsLoading
            ? <Skeleton className="h-[200px] w-full rounded-[6px]" />
            : <ProjectStatusChart data={dash?.projectStatusData ?? []} />
          }
        </Card>

        {/* Workspace Productivity */}
        <Card className="p-5">
          <h3 className="mb-4">Workspace Productivity</h3>
          {statsLoading
            ? <Skeleton className="h-[200px] w-full rounded-[6px]" />
            : <WorkspaceProductivityChart data={dash?.workspaceProductivityData ?? []} />
          }
        </Card>

        {/* Task Priority */}
        <Card className="p-5">
          <h3 className="mb-4">Task Priority</h3>
          {statsLoading
            ? <Skeleton className="h-[200px] w-full rounded-[6px]" />
            : <TaskPriorityChart data={dash?.taskPriorityData ?? []} />
          }
        </Card>
      </div>

      {/* Bottom widgets */}
      {!statsLoading && dash && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Recent Projects</h3>
              <Link
                to="/workspaces"
                className="flex items-center gap-1 text-[13px] transition-colors"
                style={{ color: "var(--brand)" }}
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <RecentProjects projects={dash.recentProjects ?? []} />
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3>Upcoming Tasks</h3>
              <Link
                to="/my-tasks"
                className="flex items-center gap-1 text-[13px] transition-colors"
                style={{ color: "var(--brand)" }}
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>
            <UpcomingTasks tasks={dash.upcomingTasks ?? []} />
          </Card>
        </div>
      )}
    </div>
  );
}
