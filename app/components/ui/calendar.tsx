import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-[13px]", className)}
      classNames={{
        months:           "flex flex-col sm:flex-row gap-2",
        month:            "flex flex-col gap-4",
        caption:          "flex justify-center pt-1 relative items-center w-full",
        caption_label:    "text-[13px] font-medium text-[var(--text-primary)]",
        nav:              "flex items-center gap-1",
        nav_button:       cn(
          "h-7 w-7 rounded-[6px] border border-[var(--border-color)] flex items-center justify-center",
          "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next:     "absolute right-1",
        table:            "w-full border-collapse",
        head_row:         "flex",
        head_cell:        "rounded w-8 text-[11px] font-medium text-[var(--text-tertiary)] text-center",
        row:              "flex w-full mt-1",
        cell:             cn(
          "relative p-0 text-center text-[13px] focus-within:relative focus-within:z-20",
          "[&:has([aria-selected])]:bg-[var(--bg-hover)] rounded-[4px]"
        ),
        day:              cn(
          "h-8 w-8 p-0 font-normal rounded-[4px] text-[var(--text-primary)]",
          "hover:bg-[var(--bg-hover)] aria-selected:opacity-100 transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
        ),
        day_selected:     "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)] focus:bg-[var(--brand)]",
        day_today:        "border border-[var(--brand)] text-[var(--brand)]",
        day_outside:      "text-[var(--text-tertiary)] opacity-50",
        day_disabled:     "text-[var(--text-tertiary)] opacity-30 pointer-events-none",
        day_range_middle: "aria-selected:bg-[var(--bg-hover)] aria-selected:text-[var(--text-primary)]",
        day_hidden:       "invisible",
        ...classNames,
      }}
      components={{
        IconLeft:  () => <ChevronLeft size={14} />,
        IconRight: () => <ChevronRight size={14} />,
      }}
      {...props}
    />
  );
}

export { Calendar };
