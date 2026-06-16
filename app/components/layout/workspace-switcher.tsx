import type { Workspace } from "@/types";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  collapsed: boolean;
  onCreateWorkspace: () => void;
}

export function WorkspaceSwitcher({
  workspaces,
  collapsed,
  onCreateWorkspace,
}: WorkspaceSwitcherProps) {
  const { selectedWorkspace, setSelectedWorkspace } = useWorkspaceContext();

  const current = selectedWorkspace ?? workspaces[0] ?? null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2.5 w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]",
            collapsed && "justify-center px-0"
          )}
          aria-label="Switch workspace"
        >
          {current ? (
            <>
              <WorkspaceAvatar
                name={current.name}
                color={current.color}
                size="sm"
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-sm font-medium text-[var(--text-primary)] truncate">
                    {current.name}
                  </span>
                  <ChevronDown
                    className="size-3.5 text-[var(--text-tertiary)] shrink-0"
                    aria-hidden="true"
                  />
                </>
              )}
            </>
          ) : (
            <>
              <div className="size-6 rounded-md bg-[var(--bg-selected)] flex items-center justify-center">
                <Plus className="size-3.5 text-[var(--text-tertiary)]" />
              </div>
              {!collapsed && (
                <span className="text-sm text-[var(--text-tertiary)]">
                  Select workspace
                </span>
              )}
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="start" side="right">
        <DropdownMenuLabel className="text-xs text-[var(--text-tertiary)] font-normal">
          Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws._id}
            className="gap-2.5 cursor-pointer"
            onSelect={() => setSelectedWorkspace(ws)}
            asChild
          >
            <Link to={`/workspaces/${ws._id}`}>
              <WorkspaceAvatar name={ws.name} color={ws.color} size="xs" />
              <span className="truncate text-sm">{ws.name}</span>
              {current?._id === ws._id && (
                <span className="ml-auto size-1.5 rounded-full bg-[var(--brand)]" />
              )}
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={onCreateWorkspace}
          className="gap-2 text-[var(--text-secondary)] cursor-pointer"
        >
          <Plus className="size-3.5" aria-hidden="true" />
          New workspace
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            to="/workspaces"
            className="gap-2 text-[var(--text-secondary)] cursor-pointer"
          >
            View all workspaces
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
