import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Braces, Download, FileJson, FileText, Terminal } from "lucide-react";

import { Container, PageHero } from "@/components/site/PageHero";
import { REALMAILPRO } from "@/content/realmailpro";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/resources")({
  head: ({ matches }) =>
    seo({
      path: "/resources",
      title: "Developer Resources",
      description: "Download the RealMailPro OpenAPI 3.1 spec and Postman collection, and find official RealMailPro links and integration guides.",
      matches,
    }),
  component: Resources,
});

const DOWNLOADS = [
  { icon: FileJson, title: "OpenAPI 3.1 specification", text: "Six published endpoints, schemas from published examples, unknowns marked.", href: "/downloads/openapi.yaml", file: "openapi.yaml" },
  { icon: Braces, title: "Postman collection", text: "v2.1 collection with Bearer auth and variables. No credentials included.", href: "/downloads/realmailpro.postman_collection.json", file: "realmailpro.postman_collection.json" },
];

const OFFICIAL = [
  { title: "RealMailPro API docs", href: REALMAILPRO.docsUrl },
  { title: "Developer API — pricing & keys", href: REALMAILPRO.developerApiUrl },
  { title: "Temp Mail API overview", href: REALMAILPRO.tempMailApiUrl },
  { title: "RealMailPro terms", href: REALMAILPRO.termsUrl },
  { title: "RealMailPro privacy policy", href: REALMAILPRO.privacyUrl },
];

const GUIDES = [
  { icon: Terminal, title: "Getting started", slug: "getting-started" },
  { icon: FileText, title: "Integration examples", slug: "examples" },
  { icon: FileText, title: "Troubleshooting", slug: "troubleshooting" },
] as const;

function Resources() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Everything to integrate RealMailPro.">
        Machine-readable specs, guides and links to RealMailPro's own documentation.
      </PageHero>
      <Container className="space-y-16 py-16">
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Downloads</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {DOWNLOADS.map((d) => (
              <a key={d.file} href={d.href} download={d.file} className="group flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-card transition-colors hover:border-foreground/25">
                <d.icon className="size-6 shrink-0 text-volt-ink" aria-hidden />
                <div className="min-w-0">
                  <p className="font-medium">{d.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{d.text}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-foreground"><Download className="size-3.5" /> {d.file}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Guides</h2>
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link to="/docs/realmailpro/$slug" params={{ slug: g.slug }} className="flex items-center gap-3 px-5 py-4 text-sm hover:bg-accent">
                    <g.icon className="size-4 text-muted-foreground" aria-hidden /> {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Official RealMailPro links</h2>
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
              {OFFICIAL.map((o) => (
                <li key={o.href}>
                  <a href={o.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-5 py-4 text-sm hover:bg-accent">
                    {o.title} <ArrowUpRight className="size-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Container>
    </>
  );
}
