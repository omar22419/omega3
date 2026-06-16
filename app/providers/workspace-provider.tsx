import type { Workspace } from "@/types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface WorkspaceContextValue {
  selectedWorkspace: Workspace | null;
  selectedWorkspaceId: string | null;
  setSelectedWorkspace: (workspace: Workspace) => void;
  clearSelectedWorkspace: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(
  undefined
);

export function WorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedWorkspace, setSelectedWorkspaceState] =
    useState<Workspace | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("selectedWorkspaceId");
    if (stored) {
      // We only restore the ID; the full workspace object gets set by
      // dashboard-layout once it fetches workspaces.
    }
  }, []);

  const setSelectedWorkspace = useCallback((workspace: Workspace) => {
    localStorage.setItem("selectedWorkspaceId", workspace._id);
    setSelectedWorkspaceState(workspace);
  }, []);

  const clearSelectedWorkspace = useCallback(() => {
    localStorage.removeItem("selectedWorkspaceId");
    setSelectedWorkspaceState(null);
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        selectedWorkspace,
        selectedWorkspaceId: selectedWorkspace?._id ?? null,
        setSelectedWorkspace,
        clearSelectedWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx)
    throw new Error("useWorkspaceContext must be used inside WorkspaceProvider");
  return ctx;
}
