import { cva } from "class-variance-authority";

import { API_STATUS_LABEL, type ApiStatus } from "@/content/realmailpro";
import { cn } from "@/lib/utils";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-wider whitespace-nowrap",
  {
    variants: {
      tone: {
        available: "border-success/30 bg-success/10 text-success",
        "in-progress": "border-info/30 bg-info/10 text-info",
        "requires-verification": "border-warning/30 bg-warning/10 text-warning",
        planned: "border-border bg-muted text-muted-foreground",
      },
    },
  },
);

export function StatusBadge({ status, label, className }: { status: ApiStatus; label?: string; className?: string }) {
  return (
    <span className={cn(badge({ tone: status }), className)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {label ?? API_STATUS_LABEL[status]}
    </span>
  );
}

export function MethodTag({ method }: { method: "GET" | "POST" }) {
  return (
    <span
      className={cn(
        "inline-flex w-12 justify-center rounded border px-1.5 py-0.5 font-mono text-[0.68rem] font-semibold",
        method === "GET" ? "border-info/30 bg-info/10 text-info" : "border-success/30 bg-success/10 text-success",
      )}
    >
      {method}
    </span>
  );
}
