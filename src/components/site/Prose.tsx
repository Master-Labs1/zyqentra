import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Renders a tiny inline-markdown subset: **bold**, `code` and [links](href). */
export function Inline({ text }: { text: string }) {
  const router = useRouter();
  const parts: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    if (m[1]) parts.push(<strong key={i++} className="font-semibold text-foreground">{m[1]}</strong>);
    else if (m[2])
      parts.push(
        <code key={i++} className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {m[2]}
        </code>,
      );
    else if (m[3] && m[4]) {
      const href = m[4];
      const internal = href.startsWith("/");
      parts.push(
        <a
          key={i++}
          href={href}
          className="font-medium text-foreground underline decoration-volt-ink/60 underline-offset-4 transition-colors hover:decoration-volt-ink"
          {...(internal
            ? {
                onClick: (e: React.MouseEvent) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                  e.preventDefault();
                  router.history.push(href);
                },
              }
            : { target: "_blank", rel: "noopener noreferrer" })}
        >
          {m[3]}
        </a>,
      );
    }
    last = start + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
