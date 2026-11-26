import { AlertTriangle, CheckCircle2, Info, SearchCheck } from "lucide-react";

import { CodeBlock } from "@/components/site/CodeBlock";
import { Inline } from "@/components/site/Prose";
import { MethodTag, StatusBadge } from "@/components/site/StatusBadge";
import type { Block } from "@/content/docs";
import { REALMAILPRO } from "@/content/realmailpro";
import { cn } from "@/lib/utils";

const CALLOUT = {
  info: { icon: Info, cls: "border-info/30 bg-info/5", iconCls: "text-info" },
  warning: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/5", iconCls: "text-warning" },
  verify: { icon: SearchCheck, cls: "border-warning/40 bg-warning/5 border-dashed", iconCls: "text-warning" },
  success: { icon: CheckCircle2, cls: "border-success/30 bg-success/5", iconCls: "text-success" },
} as const;

export function DocBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="leading-7 text-muted-foreground">
                <Inline text={b.text} />
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={b.id} className="group scroll-mt-24 pt-6 text-xl font-semibold tracking-tight">
                <a href={`#${b.id}`} className="hover:underline hover:decoration-border hover:underline-offset-8">
                  {b.text}
                </a>
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="scroll-mt-24 pt-3 text-base font-semibold">
                {b.text}
              </h3>
            );
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={cn("space-y-2 pl-5 text-muted-foreground marker:text-subtle", b.ordered ? "list-decimal" : "list-disc")}>
                {b.items.map((it, j) => (
                  <li key={j} className="pl-1 leading-7">
                    <Inline text={it} />
                  </li>
                ))}
              </Tag>
            );
          }
          case "code":
            return <CodeBlock key={i} tabs={b.tabs} {...(b.title ? { title: b.title } : {})} />;
          case "callout": {
            const c = CALLOUT[b.tone];
            const Icon = c.icon;
            return (
              <aside key={i} className={cn("flex gap-3 rounded-xl border p-4", c.cls)}>
                <Icon className={cn("mt-0.5 size-4 shrink-0", c.iconCls)} aria-hidden />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-foreground">{b.title}</p>
                  <p className="leading-6 text-muted-foreground">
                    <Inline text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {b.head.map((h) => (
                        <th key={h} scope="col" className="px-4 py-2.5 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {b.rows.map((r, j) => (
                      <tr key={j}>
                        {r.map((cell, k) => (
                          <td key={k} className={cn("px-4 py-2.5 align-top", k === 0 ? "text-foreground" : "text-muted-foreground")}>
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "endpoint":
            return (
              <div key={i} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <MethodTag method={b.method} />
                <code className="min-w-0 break-all font-mono text-sm text-foreground">
                  <span className="text-subtle">{REALMAILPRO.baseUrl.replace("https://", "")}</span>
                  {b.path}
                </code>
                <span className="ml-auto flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{b.cost}</span>
                  <StatusBadge status="requires-verification" />
                </span>
              </div>
            );
        }
      })}
    </div>
  );
}
