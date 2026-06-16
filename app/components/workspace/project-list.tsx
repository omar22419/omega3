import type { Project } from "@/types";
import { ProjectCard } from "@/components/project/project-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props { workspaceId: string; projects: Project[]; onCreateProject: () => void; }

export function ProjectList({ workspaceId, projects, onCreateProject }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-medium text-[var(--text-primary)]">
          Projects
          <span className="ml-2 text-[var(--text-tertiary)] font-normal text-[13px]">{projects.length}</span>
        </h2>
        <Button variant="secondary" size="sm" onClick={onCreateProject}>
          <Plus size={14} /> New project
        </Button>
      </div>
      {projects.length === 0 ? (
        <div
          className="rounded-[8px] border border-dashed border-[var(--border-color)] flex flex-col items-center justify-center py-12 text-center"
        >
          <p className="text-[var(--text-primary)] font-medium mb-1">No projects yet</p>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4">
            Create your first project to start organizing tasks.
          </p>
          <Button variant="primary" size="sm" onClick={onCreateProject}>
            <Plus size={14} /> New project
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(p => (
            <ProjectCard key={p._id} project={p} workspaceId={workspaceId} />
          ))}
        </div>
      )}
    </section>
  );
}
