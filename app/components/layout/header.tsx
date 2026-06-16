import { useLocation, Link } from "react-router";
import { ChevronRight, Search, Bell, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { getInitials } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function useBreadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === "/dashboard" || pathname === "/")          return [{ label: "Dashboard" }];
  if (pathname.startsWith("/workspaces"))                     return [{ label: "Workspaces", href: "/workspaces" }];
  if (pathname === "/my-tasks")                               return [{ label: "My Tasks" }];
  if (pathname === "/members")                                return [{ label: "Members" }];
  if (pathname.startsWith("/user/profile"))                   return [{ label: "Profile" }];
  return [];
}

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const crumbs = useBreadcrumbs();

  return (
    <header
      className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between px-4 md:px-6 shrink-0"
      role="banner"
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumbs */}
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px]">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={13} className="text-[var(--text-tertiary)]" aria-hidden="true" />}
                {c.href ? (
                  <Link to={c.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{c.label}</Link>
                ) : (
                  <span className="text-[var(--text-primary)] font-medium">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search trigger */}
        <button className="hidden md:flex items-center gap-2 h-8 px-3 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-hover)] transition-colors">
          <Search size={14} className="text-[var(--text-tertiary)]" aria-hidden="true" />
          <span className="text-[13px] text-[var(--text-tertiary)]">Search</span>
          <div className="flex items-center gap-0.5 ml-8">
            <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-hover)] border border-[var(--border-color)] rounded text-[var(--text-tertiary)]">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-[var(--bg-hover)] border border-[var(--border-color)] rounded text-[var(--text-tertiary)]">K</kbd>
          </div>
        </button>

        {/* Bell */}
        <button className="h-8 w-8 flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors" aria-label="Notifications">
          <Bell size={16} />
        </button>

        {/* User avatar */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]" aria-label="User menu">
                <Avatar style={{ width: 32, height: 32 }}>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback style={{ fontSize: 11, background: "var(--brand)", color: "#fff" }}>
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: 8, minWidth: 180 }}>
              <div className="px-3 py-2">
                <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{user.username}</p>
                <p className="text-[11px] text-[var(--text-tertiary)] truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator style={{ background: "var(--border-color)" }} />
              <DropdownMenuItem asChild>
                <Link to="/user/profile" className="text-[13px] cursor-pointer">Profile settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ background: "var(--border-color)" }} />
              <DropdownMenuItem
                onSelect={logout}
                className="text-[13px] cursor-pointer"
                style={{ color: "var(--priority-high)" }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
