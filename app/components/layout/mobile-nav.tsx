import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import type { Workspace } from "@/types";

interface MobileNavProps {
  workspaces?: Workspace[];
  trigger: React.ReactNode;
}

export function MobileNav({ workspaces, trigger }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-[220px]" style={{ background: "var(--bg-secondary)", borderRight: "1px solid var(--border-color)" }}>
          <Sidebar workspaces={workspaces} onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
