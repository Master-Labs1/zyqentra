import { Check, Copy } from "lucide-react";
import { useState } from "react";

import type { CodeTab } from "@/content/docs";
import { highlight } from "@/lib/highlight";
import { cn } from "@/lib/utils";

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          setTimeout(() => setDone(false), 1600);
        } catch {
          /* clipboard blocked */
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[0.7rem] text-code-foreground/60 transition-colors hover:bg-code-foreground/10 hover:text-code-foreground",
        className,
      )}
      aria-label={done ? "Copied" : "Copy code"}
    >
      {done ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}

export function CodeBlock({ tabs, title, className }: { tabs: CodeTab[]; title?: string; className?: string }) {
  const [active, setActive] = useState(0);
  const tab = tabs[active] ?? tabs[0];
  if (!tab) return null;
  return (
    <figure className={cn("overflow-hidden rounded-xl border border-border bg-code text-code-foreground shadow-card", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-code-foreground/10 px-2">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto py-1.5" role="tablist" aria-label={title ?? "Code example"}>
          {title && tabs.length === 1 ? (
            <span className="px-2 font-mono text-[0.72rem] text-code-foreground/60">
              {title} · {tab.label}
            </span>
          ) : (
            tabs.map((t, i) => (
              <button
                key={t.label}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-mono text-[0.72rem] whitespace-nowrap transition-colors",
                  i === active ? "bg-code-foreground/10 text-code-foreground" : "text-code-foreground/50 hover:text-code-foreground",
                )}
              >
                {t.label}
              </button>
            ))
          )}
        </div>
        <CopyButton value={tab.code} />
      </div>
      <pre className="overflow-x-auto p-4 text-[0.8rem] leading-relaxed">
        <code className="font-mono">{highlight(tab.code, tab.lang)}</code>
      </pre>
    </figure>
  );
}
