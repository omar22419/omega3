import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-4 transition-colors"
    >
      <ArrowLeft size={14} aria-hidden="true" />
      Back
    </button>
  );
}
