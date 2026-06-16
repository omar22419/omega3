import type { ReactNode } from "react";

interface Props { title: string; description?: string; children?: ReactNode; }

export function PageHeader({ title, description, children }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="mb-1">{title}</h1>
        {description && <p className="text-[var(--text-secondary)]">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
