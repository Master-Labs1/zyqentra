import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { RealMailProMark } from "@/components/brand/Logo";
import { AppLink } from "@/components/site/AppLink";
import { DOCS, DOC_SECTIONS, docPath } from "@/content/docs";
import { REALMAILPRO } from "@/content/realmailpro";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/")({
  head: ({ matches }) =>
    seo({
      path: "/docs",
      title: "Documentation",
      description: "Zyqentra documentation hub for the RealMailPro API: guides, API reference, SDKs and changelog.",
      matches,
    }),
  component: DocsHub,
});

function DocsHub() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Documentation</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Docs</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Zyqentra documents a single product. Start with the overview, or jump to a section.
      </p>

      <Link to="/docs/realmailpro" className="group mt-10 block rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-foreground/25">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <RealMailProMark className="text-lg" />
          <span className="font-mono text-xs text-muted-foreground">API {REALMAILPRO.apiVersion} · {DOCS.length} pages</span>
        </div>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Temporary Gmail.com and Outlook.com inboxes, OTP reading, credits and authentication — documented from RealMailPro's public docs.
        </p>
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium group-hover:text-volt-ink">
          Open RealMailPro docs <ArrowRight className="size-4" />
        </span>
      </Link>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DOC_SECTIONS.map((s) => (
          <section key={s} className="rounded-2xl border border-border p-5">
            <h2 className="eyebrow">{s}</h2>
            <ul className="mt-4 space-y-3">
              {DOCS.filter((d) => d.section === s).map((d) => (
                <li key={d.slug}>
                  <AppLink href={docPath(d.slug)} className="block">
                    <span className="text-sm font-medium hover:text-volt-ink">{d.nav}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">{d.description}</span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
