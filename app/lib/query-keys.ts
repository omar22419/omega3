export const queryKeys = {
  workspaces: {
    all: () => ["workspaces"] as const,
    detail: (id: string) => ["workspaces", id] as const,
    stats: (id: string) => ["workspaces", id, "stats"] as const,
    members: (id: string) => ["workspaces", id, "members"] as const,
    withProjects: (id: string) => ["workspaces", id, "projects"] as const,
  },
  projects: {
    detail: (id: string) => ["projects", id] as const,
    withTasks: (id: string) => ["projects", id, "tasks"] as const,
  },
  tasks: {
    mine: () => ["tasks", "mine"] as const,
    detail: (id: string) => ["tasks", id] as const,
    comments: (id: string) => ["tasks", id, "comments"] as const,
    activity: (id: string) => ["tasks", id, "activity"] as const,
  },
  user: {
    profile: () => ["user", "profile"] as const,
  },
} as const;
