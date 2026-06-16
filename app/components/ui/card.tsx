import * as React from "react";
import { cn } from "@/lib/utils";

// Figma: bg-bg-secondary border border-border rounded-[8px]
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[8px]", className)}
      {...props}
    />
  );
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 pt-5 pb-0 flex flex-col gap-1", className)} {...props} />;
}
function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return <h3 className={cn("text-[14px] font-medium text-[var(--text-primary)]", className)} {...props} />;
}
function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-[11px] text-[var(--text-tertiary)]", className)} {...props} />;
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center px-5 pb-5", className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
