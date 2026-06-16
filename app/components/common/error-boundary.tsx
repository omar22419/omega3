import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props  { children: ReactNode; fallback?: ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center">
          <div className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-4"
            style={{ background: "var(--priority-high)", opacity: 0.15 }}>
            <AlertTriangle size={22} style={{ color: "var(--priority-high)" }} />
          </div>
          <p className="text-[14px] font-medium text-[var(--text-primary)] mb-1">Something went wrong</p>
          <p className="text-[13px] text-[var(--text-secondary)] mb-4 max-w-xs">
            {this.state.error?.message ?? "An unexpected error occurred."}
          </p>
          <Button variant="secondary" size="sm" onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
