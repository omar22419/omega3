import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Home, Briefcase, CheckSquare, Users, ChevronLeft, ChevronRight, Sun, Moon, X, LogOut } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useTheme } from "@/providers/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";
import type { Workspace } from "@/types";

const NAV = [
  { path: "/dashboard", icon: Home,        label: "Dashboard"  },
  { path: "/workspaces",icon: Briefcase,   label: "Workspaces" },
  { path: "/my-tasks",  icon: CheckSquare, label: "My Tasks"   },
  { path: "/members",   icon: Users,       label: "Members"    },
];

interface SidebarProps {
  workspaces?: Workspace[];
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const s = localStorage.getItem("sidebarCollapsed");
    if (s === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    const next = !collapsed;
    localStorage.setItem("sidebarCollapsed", String(next));
    setCollapsed(next);
  };

  const isActive = (path: string) =>
    path === "/dashboard" ? pathname === path : pathname.startsWith(path);

  return (
    <aside
      className={cn(
        "sidebar-transition h-screen bg-[var(--bg-secondary)] border-r border-[var(--border-color)] flex flex-col shrink-0",
        collapsed ? "w-12" : "w-[220px]"
      )}
      aria-label="Main navigation"
    >
      {/* Logo row */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--border-color)] h-14">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[var(--brand)] flex items-center justify-center text-white text-[12px] font-semibold select-none">
              Ω
            </div>
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">Omega3</span>
          </div>
        )}
        <div className="ml-auto flex items-center gap-1">
          {onClose && (
            <button onClick={onClose} className="md:hidden p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors" aria-label="Close menu">
              <X size={16} />
            </button>
          )}
          <button
            onClick={toggle}
            className="hidden md:flex p-1 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 h-8 rounded-md transition-colors text-[13px]",
                active
                  ? "bg-[var(--brand)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-[var(--border-color)] space-y-0.5">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 h-8 w-full rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors text-[13px]"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          {!collapsed && "Theme"}
        </button>

        {/* User row */}
        {user && (
          <Link
            to="/user/profile"
            onClick={onClose}
            className="flex items-center gap-3 px-3 h-10 w-full rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Avatar className="shrink-0" style={{ width: 24, height: 24 }}>
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback style={{ fontSize: 10, background: "var(--brand)", color: "#fff" }}>
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-[var(--text-primary)] truncate">{user.username}</div>
                <div className="text-[11px] text-[var(--text-tertiary)] truncate">{user.email}</div>
              </div>
            )}
          </Link>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 h-8 w-full rounded-md text-[var(--text-secondary)] hover:text-[var(--priority-high)] hover:bg-[var(--bg-hover)] transition-colors text-[13px]"
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden="true" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}
