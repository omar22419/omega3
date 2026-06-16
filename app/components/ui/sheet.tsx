"use client";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

function Sheet(props: React.ComponentProps<typeof SheetPrimitive.Root>) { return <SheetPrimitive.Root {...props} />; }
function SheetTrigger(props: React.ComponentProps<typeof SheetPrimitive.Trigger>) { return <SheetPrimitive.Trigger {...props} />; }
function SheetClose(props: React.ComponentProps<typeof SheetPrimitive.Close>) { return <SheetPrimitive.Close {...props} />; }
function SheetPortal(props: React.ComponentProps<typeof SheetPrimitive.Portal>) { return <SheetPrimitive.Portal {...props} />; }
function SheetOverlay({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      className={cn("fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
      {...props}
    />
  );
}
function SheetContent({ className, children, side = "left", ...props }: React.ComponentProps<typeof SheetPrimitive.Content> & { side?: "left" | "right" }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        className={cn(
          "fixed z-50 flex flex-col",
          side === "left" && "inset-y-0 left-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
          side === "right" && "inset-y-0 right-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
          className
        )}
        style={{ background: "var(--bg-secondary)", borderRight: side === "left" ? "1px solid var(--border-color)" : undefined, borderLeft: side === "right" ? "1px solid var(--border-color)" : undefined }}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-4 top-4 rounded p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Close">
          <X size={16} />
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetPortal, SheetOverlay };
