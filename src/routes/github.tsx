import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CircleDashed, Github, Lock } from "lucide-react";

import { Container, PageHero } from "@/components/site/PageHero";
import { StatusBadge } from "@/components/site/StatusBadge";
import { REPO_TREE, SDKS } from "@/content/repo";
import { SITE } from "@/content/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/github")({
  head: ({ matches }) =>
    seo({
      path: "/github",
      title: "GitHub — realmailpro-api repository",
      description:
        "The Zyqentra/realmailpro-api repository: RealMailPro docs, OpenAPI spec, TypeScript and Python SDK sources, Postman collection and CI.",
      matches,
    }),
  component: GithubPage,
});

const PHASES = [
  { t: "Build the developer portal", done: true },
  { t: "Prepare repository files", done: true },
  { t: "Security scan and content review", done: true },
  { t: "Verify API docs against a live key", done: false },
  { t: "Owner approval to make the repository public", done: false },
];

const CI = [
  "TypeScript SDK: type check + unit tests (Node 20)",
  "Python SDK: unit tests on Python 3.9 and 3.12",
  "OpenAPI lint with Redocly",
  "Postman collection JSON validation",
  "Markdown link check",
  "CodeQL for JavaScript/TypeScript and Python · Dependabot",
];

function GithubPage() {
  const isPublic = SITE.repoVisibility === "public";
  return (
    <>
      <PageHero
        eyebrow="GitHub"
        title={`${SITE.githubOrg}/${SITE.githubRepo}`}
        aside={<StatusBadge status={isPublic ? "available" : "in-progress"} label={isPublic ? "Public" : "Private · pending owner approval"} />}
      >
        The flagship repository for RealMailPro developers: documentation, an OpenAPI specification, SDK sources, examples and CI — and nothing from RealMailPro's private backend.
      </PageHero>
      <Container className="grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Repository layout</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 text-sm">
                <Github className="size-4" /> <span className="font-mono">{SITE.githubRepo}</span>
                <span className="ml-auto font-mono text-xs text-muted-foreground">{SITE.license} · SDK & examples</span>
              </div>
              <ul className="divide-y divide-border font-mono text-sm">
                {REPO_TREE.map((r) => (
                  <li key={r.path} className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:gap-4">
                    <span>{r.path}</span>
                    <span className="text-xs text-subtle sm:ml-auto sm:text-sm">{r.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Continuous integration</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {CI.map((c) => <li key={c} className="rounded-xl border border-border p-4 text-sm text-muted-foreground">{c}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Licensing &amp; ownership</h2>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-border">
                  {[
                    ["SDK source code & example integrations", "MIT (Zyqentra)"],
                    ["Documentation text in the repository", "MIT (Zyqentra)"],
                    ["RealMailPro API service", "Proprietary — operated by RealMailPro"],
                    ["RealMailPro backend implementation", "Private — not included"],
                    ["RealMailPro name, logo and branding", "Trademarks of their owner — not licensed"],
                  ].map(([a, b]) => (
                    <tr key={a}><td className="px-5 py-3 font-medium">{a}</td><td className="px-5 py-3 text-muted-foreground">{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-2"><Lock className="size-4 text-warning" /><h2 className="font-semibold">Publication process</h2></div>
            <ol className="mt-5 space-y-3 text-sm">
              {PHASES.map((p, i) => (
                <li key={p.t} className="flex gap-3">
                  <span className={p.done ? "text-success" : "text-subtle"}>{p.done ? "✓" : <CircleDashed className="inline size-4" />}</span>
                  <span className={p.done ? "" : "text-muted-foreground"}>{i + 1}. {p.t}</span>
                </li>
              ))}
            </ol>
            {!isPublic && (
              <p className="mt-5 text-xs text-muted-foreground">
                The repository link will appear here once it is public. Until then it returns 404 to visitors.
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold">SDKs in this repository</h2>
            <ul className="mt-4 space-y-4 text-sm">
              {SDKS.map((s) => (
                <li key={s.name}>
                  <p className="font-medium">{s.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">{s.pkg}</p>
                  <p className="text-muted-foreground">{s.status}</p>
                </li>
              ))}
            </ul>
          </div>
          <Link to="/resources" className="flex items-center justify-between rounded-2xl border border-border p-6 text-sm font-medium hover:border-foreground/25">
            Download the OpenAPI spec and Postman collection <ArrowRight className="size-4" />
          </Link>
        </aside>
      </Container>
    </>
  );
}
