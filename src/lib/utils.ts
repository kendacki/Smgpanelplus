import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-NG").format(value);
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateReference(prefix = "SMG") {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

export function generateApiKey() {
  const rand = crypto.randomUUID().replaceAll("-", "");
  return `smg_${rand}${Math.random().toString(36).slice(2, 10)}`;
}

export function orderStatusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    PARTIAL: "Partial",
    CANCELED: "Canceled",
    REFUND: "Refunded",
  };
  return map[status] ?? status;
}

export function paymentStatusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    REJECTED: "Rejected",
  };
  return map[status] ?? status;
}
