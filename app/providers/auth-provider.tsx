import type { User } from "@/types";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { queryClient } from "./react-query-provider";
import { useLocation, useNavigate } from "react-router";
import { PUBLIC_ROUTES } from "@/lib/constants";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { data: { token: string; userData: User } }) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                   = useState<User | null>(null);
  const [isAuthenticated, setIsAuth]      = useState(false);
  const [isLoading, setIsLoading]         = useState(true);

  const navigate     = useNavigate();
  const { pathname } = useLocation();

  // Bootstrap from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored) as User);
        setIsAuth(true);
      } else if (!PUBLIC_ROUTES.includes(pathname)) {
        navigate("/sign-in", { replace: true });
      }
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIX #8: Clear ALL workspace-related localStorage keys on logout.
  // Original clears: token, user, selectedWorkspace, selectedWorkspaceId.
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedWorkspace");      // matches original
    localStorage.removeItem("selectedWorkspaceId");
    setUser(null);
    setIsAuth(false);
    queryClient.clear();
  }, []);

  // Force-logout on 401 (dispatched by Axios interceptor)
  useEffect(() => {
    const handle = () => {
      logout();
      navigate("/sign-in", { replace: true });
    };
    window.addEventListener("force-logout", handle);
    return () => window.removeEventListener("force-logout", handle);
  }, [logout, navigate]);

  const login = useCallback(
    (data: { data: { token: string; userData: User } }) => {
      const { token, userData } = data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setIsAuth(true);
    },
    []
  );

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...patch };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, login, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
