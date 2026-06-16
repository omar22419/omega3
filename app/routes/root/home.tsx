import { Link } from "react-router";

export function meta() {
  return [{ title: "Omega3 — Project Management" }];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ background: "var(--bg-primary)" }}>
      <div className="w-12 h-12 rounded-[10px] bg-[var(--brand)] flex items-center justify-center text-white text-[22px] font-semibold mb-6 select-none">Ω</div>
      <h1 className="text-[28px] font-semibold text-[var(--text-primary)] mb-3 max-w-md">
        Project management for <span style={{ color: "var(--brand)" }}>modern teams</span>
      </h1>
      <p className="text-[15px] text-[var(--text-secondary)] max-w-sm mb-8">
        Organize work, track progress, and ship faster with Omega3.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/sign-up" className="px-5 py-2 rounded-[6px] bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-white text-[14px] font-medium transition-colors">
          Get started free
        </Link>
        <Link to="/sign-in" className="px-5 py-2 rounded-[6px] border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] text-[14px] font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </div>
  );
}
