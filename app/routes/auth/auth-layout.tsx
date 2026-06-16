import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/providers/auth-provider";
import { FullPageLoader } from "@/components/common/loader";

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex w-full min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Left: form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-[var(--brand)] flex items-center justify-center text-white font-semibold select-none">
              Ω
            </div>
            <span className="text-[20px] font-semibold text-[var(--text-primary)]">Omega3</span>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Right: decorative preview */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 border-l border-[var(--border-color)]"
        style={{ background: "var(--bg-secondary)" }}
        aria-hidden="true"
      >
        <div className="max-w-md w-full space-y-6">
          <div className="rounded-[12px] border border-[var(--border-color)] p-6 space-y-4" style={{ background: "var(--bg-primary)" }}>
            {/* Fake header */}
            <div className="h-8 rounded-[6px] border border-[var(--border-color)] flex items-center px-3 gap-2" style={{ background: "var(--bg-secondary)" }}>
              <div className="w-4 h-4 rounded bg-[var(--brand)]" />
              <div className="h-2 w-24 rounded" style={{ background: "var(--bg-hover)" }} />
            </div>
            {/* Fake stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="rounded-[8px] border border-[var(--border-color)] p-3 space-y-2" style={{ background: "var(--bg-secondary)" }}>
                  <div className="h-2 w-14 rounded" style={{ background: "var(--bg-hover)" }} />
                  <div className="h-5 w-10 rounded" style={{ background: "var(--brand)", opacity: 0.3 }} />
                </div>
              ))}
            </div>
            {/* Fake chart */}
            <div className="h-28 rounded-[8px] border border-[var(--border-color)]" style={{ background: "var(--bg-secondary)" }} />
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] text-center">
            Ship faster with Omega3's powerful project management
          </p>
        </div>
      </div>
    </div>
  );
}
