import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { onCreateWorkspace: () => void; }

export function OnboardingPrompt({ onCreateWorkspace }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div
        className="w-16 h-16 rounded-[14px] flex items-center justify-center mb-6"
        style={{ background: "var(--brand-light)" }}
      >
        <Rocket size={28} style={{ color: "var(--brand)" }} aria-hidden="true" />
      </div>
      <h1 className="text-[22px] font-semibold mb-2">Welcome to Omega3</h1>
      <p className="text-[14px] text-[var(--text-secondary)] max-w-sm mb-8">
        Create your first workspace to start organising projects and tasks for your team.
      </p>
      <Button variant="primary" size="lg" onClick={onCreateWorkspace}>
        Create your first workspace
      </Button>
    </div>
  );
}
