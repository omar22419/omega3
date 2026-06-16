import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), "MMM d");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDueDate(date: Date | string | undefined): string {
  if (!date) return "No due date";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return formatDate(d);
}

export function isDueDateOverdue(date: Date | string | undefined): boolean {
  if (!date) return false;
  return isPast(new Date(date)) && !isToday(new Date(date));
}

export function isDueDateSoon(date: Date | string | undefined): boolean {
  if (!date) return false;
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return diff > 0 && diff < 1000 * 60 * 60 * 48; // within 48h
}

export function extractApiError(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    error.response &&
    typeof error.response === "object" &&
    "data" in error.response &&
    error.response.data &&
    typeof error.response.data === "object" &&
    "message" in error.response.data
  ) {
    return String(error.response.data.message);
  }
  return "An unexpected error occurred";
}
