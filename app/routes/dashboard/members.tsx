import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search, List, LayoutGrid, UserPlus } from "lucide-react";
import { useWorkspaceContext } from "@/providers/workspace-provider";
import { useWorkspaceDetailsQuery } from "@/hooks/queries";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/ui/skeleton";
import { getInitials, formatDate } from "@/lib/utils";
import type { Workspace } from "@/types";

const SELECT_CLS = "h-8 px-3 rounded-[4px] bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[13px] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] w-full";

export default function Members() {
  const [params, setParams] = useSearchParams();
  const { selectedWorkspaceId } = useWorkspaceContext();
  const workspaceId = params.get("workspaceId") ?? selectedWorkspaceId ?? undefined;
  const view   = (params.get("view")   ?? "grid") as "list" | "grid";
  const search = params.get("search") ?? "";

  const set = (k: string, v: string) =>
    setParams(p => { p.set(k, v); return p; }, { replace: true });

  const { data, isLoading } = useWorkspaceDetailsQuery(workspaceId ?? "");
  const workspace = data?.data as Workspace | undefined;

  const members = useMemo(() => {
    const all = workspace?.members ?? [];
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter(m => m.user.username.toLowerCase().includes(q) || m.user.email.toLowerCase().includes(q));
  }, [workspace?.members, search]);

  return (
    <div className="p-4 md:p-6 max-w-[1280px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="mb-1">Members</h1>
          <p className="text-[var(--text-secondary)]">
            {workspace ? `${workspace.members.length} members in ${workspace.name}` : "Manage your team members"}
          </p>
        </div>
        <Button variant="primary" size="md">
          <UserPlus size={16} /> Invite Member
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
          <input
            placeholder="Search members..."
            value={search}
            onChange={e => set("search", e.target.value)}
            className={SELECT_CLS + " pl-9"}
          />
        </div>
        <div className="flex border border-[var(--border-color)] rounded-[4px] overflow-hidden shrink-0">
          <button onClick={() => set("view","list")} aria-label="List view" aria-pressed={view==="list"}
            className={`px-2 py-1.5 transition-colors ${view==="list" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
            <List size={16} />
          </button>
          <button onClick={() => set("view","grid")} aria-label="Grid view" aria-pressed={view==="grid"}
            className={`px-2 py-1.5 transition-colors ${view==="grid" ? "bg-[var(--brand)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {!workspaceId ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)]">Select a workspace from the sidebar to view members.</p>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[var(--text-primary)] font-medium mb-1">{search ? "No members match your search" : "No members yet"}</p>
          <p className="text-[13px] text-[var(--text-secondary)]">{search ? "Try a different name or email." : "Invite team members to collaborate."}</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map(m => (
            <Card key={m._id} className="p-6 text-center hover:bg-[var(--bg-hover)] transition-colors">
              <div className="flex justify-center mb-4">
                <Avatar style={{ width: 64, height: 64 }}>
                  <AvatarImage src={m.user.profilePicture} />
                  <AvatarFallback style={{ fontSize: 18, background: "var(--brand)", color: "#fff" }}>
                    {getInitials(m.user.username)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <h3 className="mb-1">{m.user.username}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] mb-3 truncate">{m.user.email}</p>
              <div className="flex justify-center mb-2">
                <StatusBadge variant="status" value={m.role} />
              </div>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Joined {new Date(m.joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border-color)]">
                  {["Member","Email","Role","Joined"].map(h => (
                    <th key={h} className="text-left p-4 text-[11px] uppercase tracking-wide text-[var(--text-secondary)] font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m._id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar style={{ width: 32, height: 32 }}>
                          <AvatarImage src={m.user.profilePicture} />
                          <AvatarFallback style={{ fontSize: 11, background: "var(--brand)", color: "#fff" }}>
                            {getInitials(m.user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-[14px]">{m.user.username}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[var(--text-secondary)]">{m.user.email}</td>
                    <td className="p-4"><StatusBadge variant="status" value={m.role} /></td>
                    <td className="p-4 text-[13px] text-[var(--text-secondary)]">{formatDate(m.joinedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
