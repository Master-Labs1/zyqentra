import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Braces, FileJson, Github, KeyRound, LifeBuoy, RefreshCcw, ShieldCheck, Timer, TriangleAlert, Workflow } from "lucide-react";

import { LogoMark, RealMailProMark } from "@/components/brand/Logo";
import { CodeBlock } from "@/components/site/CodeBlock";
import { Inline } from "@/components/site/Prose";
import { MethodTag, StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { AppLink } from "@/components/site/AppLink";
import { DOCS, docPath } from "@/content/docs";
import { ENDPOINTS, REALMAILPRO, VERIFIED_CAPABILITIES } from "@/content/realmailpro";
import { REPO_TREE, SDKS } from "@/content/repo";
import { CHANGELOG, SITE } from "@/content/site";
import { originFromMatches, seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: ({ matches }) => {
    const origin = originFromMatches(matches);
    return seo({
      path: "/",
      title: "Zyqentra — Developer Infrastructure for RealMailPro",
      description:
        "RealMailPro API documentation, integration guides, SDK sources and developer tools from the Zyqentra developer ecosystem.",
      matches,
      jsonLd: [
        { "@type": "Organization", name: "Zyqentra", slogan: "Build beyond limits.", ...(origin ? { url: origin } : {}) },
        { "@type": "WebSite", name: "Zyqentra Developers", ...(origin ? { url: origin } : {}) },
      ],
    });
  },
  component: Home,
});

function SectionHead({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {text && <p className="text-muted-foreground">{text}</p>}
    </div>
  );
}

function FlowCard() {
  const lines = [
    { k: "POST", t: "/inboxes", d: '{ "service": "gmail_alias" }', c: "1 credit" },
    { k: "GET", t: "/inboxes/{id}/messages", d: "poll every 10 s", c: "3 credits" },
    { k: "GET", t: "/messages/{id}", d: "full text + HTML", c: "3 credits" },
  ] as const;
  return (
    <div className="relative animate-rise [animation-delay:150ms]">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-glow-volt blur-2xl" aria-hidden />
      <div className="overflow-hidden rounded-2xl border border-border bg-code text-code-foreground shadow-pop">
        <div className="flex items-center gap-2 border-b border-code-foreground/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-code-foreground/20" />
          <span className="size-2.5 rounded-full bg-code-foreground/20" />
          <span className="size-2.5 rounded-full bg-code-foreground/20" />
          <span className="ml-2 font-mono text-[0.7rem] text-code-foreground/50">otp-flow · api/public/v1</span>
        </div>
        <ol className="space-y-3 p-5 font-mono text-[0.78rem]">
          {lines.map((l, i) => (
            <li key={l.t} className="animate-rise rounded-lg border border-code-foreground/10 p-3" style={{ animationDelay: `${300 + i * 180}ms` }}>
              <div className="flex items-center gap-2">
                <span className={l.k === "GET" ? "tok-key" : "tok-str"}>{l.k}</span>
                <span className="truncate">{l.t}</span>
                <span className="ml-auto text-code-foreground/40">{l.c}</span>
              </div>
              <p className="mt-1 text-code-foreground/50">{l.d}</p>
            </li>
          ))}
          <li className="animate-rise rounded-lg border border-volt/40 bg-volt/10 p-3" style={{ animationDelay: "900ms" }}>
            <span className="text-code-foreground/60">"otp": </span>
            <span className="tok-str">"482913"</span>
            <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-blink bg-volt" aria-hidden />
          </li>
        </ol>
        <p className="border-t border-code-foreground/10 px-5 py-2.5 text-[0.68rem] text-code-foreground/40">
          Illustrative flow based on RealMailPro's published docs — values are examples.
        </p>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: KeyRound, title: "Bearer authentication", text: "One header, keys from environment variables, never in browser code." },
  { icon: TriangleAlert, title: "Typed error envelope", text: "`{ error: { code, message } }` mapped to clear exceptions in both SDKs." },
  { icon: Timer, title: "Timeouts by default", text: "30-second request timeout with an abortable request pipeline." },
  { icon: RefreshCcw, title: "Safe retries", text: "Backoff on 429 and 5xx for reads only. Billable inbox creation is never retried." },
];

const CODE = [
  {
    label: "cURL",
    lang: "bash",
    code: `curl -X POST ${REALMAILPRO.baseUrl}/inboxes \\\n  -H "Authorization: Bearer $REALMAILPRO_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{ "service": "gmail_alias" }'`,
  },
  {
    label: "TypeScript",
    lang: "ts",
    code: `import { RealMailPro } from "@zyqentra/realmailpro"; // pre-release, build from source\n\nconst client = new RealMailPro({ apiKey: process.env.REALMAILPRO_API_KEY });\n\nconst inbox = await client.inboxes.create({ service: "gmail_alias" });\nconst { data } = await client.inboxes.messages(inbox.id);\nconsole.log(data.find((m) => m.otp)?.otp);`,
  },
  {
    label: "Python",
    lang: "python",
    code: `from realmailpro import RealMailPro  # pre-release, install from source\n\nclient = RealMailPro()  # reads REALMAILPRO_API_KEY\n\ninbox = client.inboxes.create(service="gmail_alias")\nmessages = client.inboxes.messages(inbox["id"])\nprint(next((m["otp"] for m in messages["data"] if m.get("otp")), None))`,
  },
];

function Home() {
  const docSections = ["Start", "API", "Guides", "Reference"] as const;
  return (
    <>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 -z-10 bg-grid mask-radial" aria-hidden />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-28 lg:pt-24">
          <div className="space-y-7">
            <p className="inline-flex animate-rise items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <LogoMark className="size-3.5" /> Zyqentra <span className="text-subtle">×</span> <span className="text-signal">RealMailPro</span>
            </p>
            <h1 className="animate-rise font-display text-4xl font-semibold leading-[1.02] [animation-delay:60ms] sm:text-6xl lg:text-7xl">
              Developer Infrastructure for <span className="text-volt-ink">RealMailPro.</span>
            </h1>
            <p className="max-w-xl animate-rise text-lg text-muted-foreground [animation-delay:120ms]">
              Explore RealMailPro developer documentation, API resources, integration guides and tools through the Zyqentra developer ecosystem.
            </p>
            <div className="flex animate-rise flex-wrap gap-3 [animation-delay:180ms]">
              <Button asChild size="lg" className="h-11 px-6">
                <Link to="/docs/realmailpro">
                  Explore API Documentation <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6">
                <Link to="/github">
                  <Github /> View GitHub Repository
                </Link>
              </Button>
            </div>
            <dl className="grid max-w-lg animate-rise grid-cols-3 gap-4 border-t border-border pt-6 font-mono text-xs [animation-delay:240ms]">
              <div><dt className="text-subtle">API</dt><dd className="mt-1 text-foreground">REST · v1</dd></div>
              <div><dt className="text-subtle">Auth</dt><dd className="mt-1 text-foreground">Bearer key</dd></div>
              <div><dt className="text-subtle">Format</dt><dd className="mt-1 text-foreground">JSON</dd></div>
            </dl>
          </div>
          <FlowCard />
        </div>
      </section>

      {/* 2. Brand intro */}
      <section className="border-b border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-sm tracking-[0.3em] text-muted-foreground">{SITE.tagline}</p>
          <p className="max-w-2xl text-lg">
            Zyqentra is the developer ecosystem for <span className="text-signal">RealMailPro</span> — one parent brand, one featured product, one flagship repository, and documentation written only from what RealMailPro has actually published.
          </p>
        </div>
      </section>

      {/* 3. RealMailPro overview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHead eyebrow="The product" title="Temporary inboxes and OTPs, from your own code." text="RealMailPro creates disposable Gmail.com and Outlook.com inboxes and reads verification codes for test suites, QA flows and sign-up automation on accounts you own." />
          <a href={REALMAILPRO.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <RealMailProMark /> realmailpro.online ↗
          </a>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {VERIFIED_CAPABILITIES.map((c) => (
            <div key={c.title} className="bg-background p-6">
              <h3 className="font-medium">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground"><Inline text={c.text} /></p>
            </div>
          ))}
        </div>
        <p className="mt-4 font-mono text-xs text-subtle">Source: RealMailPro public website and docs, researched 2026-11-23.</p>
      </section>

      {/* 4. API documentation preview */}
      <section className="border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <SectionHead eyebrow="API reference" title="Six endpoints. One base URL." text="Every endpoint below is published by RealMailPro. They are marked “requires verification” until a successful authenticated call has been confirmed." />
            <code className="block break-all rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs">{REALMAILPRO.baseUrl}</code>
            <Button asChild variant="outline">
              <Link to="/docs/realmailpro/$slug" params={{ slug: "api-reference" }}>Full API reference <ArrowRight /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
            {ENDPOINTS.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <MethodTag method={e.method} />
                <code className="font-mono text-sm">{e.path}</code>
                <span className="hidden text-sm text-muted-foreground sm:inline">{e.summary}</span>
                <span className="ml-auto"><StatusBadge status={e.status} /></span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Integration features + 6. Code */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Integration" title="Built for production integrations." text="The documentation and SDK sources follow the same defaults: keys from the environment, explicit errors, bounded waits and no accidental double-billing." />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-card transition-colors hover:border-foreground/20">
                <f.icon className="size-5 text-volt-ink" aria-hidden />
                <h3 className="mt-4 font-medium">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground"><Inline text={f.text} /></p>
              </div>
            ))}
          </div>
          <CodeBlock tabs={CODE} className="self-start" />
        </div>
      </section>

      {/* 7. GitHub preview + 8. SDKs */}
      <section className="border-y border-border bg-surface/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2">
          <div className="space-y-6">
            <SectionHead eyebrow="Open source" title={`${SITE.githubOrg}/${SITE.githubRepo}`} text="The flagship repository: docs, OpenAPI spec, SDK sources, examples and CI. It stays private until the security review is complete and the owner approves publication." />
            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm">
                <Github className="size-4" /> <span className="font-mono">{SITE.githubRepo}</span>
                <span className="ml-auto"><StatusBadge status="in-progress" label="Private · pending review" /></span>
              </div>
              <ul className="divide-y divide-border font-mono text-xs">
                {REPO_TREE.map((r) => (
                  <li key={r.path} className="flex gap-4 px-4 py-2.5">
                    <span className="text-foreground">{r.path}</span>
                    <span className="ml-auto hidden text-right text-subtle sm:block">{r.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <SectionHead eyebrow="SDKs" title="Typed clients, honestly labelled." text="Both SDKs cover every published endpoint and are unit-tested against a mocked API. Neither is published to a package registry yet." />
            <div className="grid gap-4">
              {SDKS.map((s) => (
                <AppLink key={s.name} href={s.doc} className="group rounded-2xl border border-border bg-background p-6 transition-colors hover:border-foreground/25">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{s.name}</h3>
                    <StatusBadge status="planned" label={s.status} />
                  </div>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{s.path}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    {s.points.map((p) => <li key={p} className="flex gap-2"><span className="text-volt-ink">—</span>{p}</li>)}
                  </ul>
                </AppLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Docs navigation */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Documentation" title="Find what you need." />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {docSections.map((sec) => (
            <div key={sec} className="rounded-2xl border border-border p-5">
              <p className="eyebrow">{sec}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {DOCS.filter((d) => d.section === sec).map((d) => (
                  <li key={d.slug}>
                    <AppLink href={docPath(d.slug)} className="text-muted-foreground transition-colors hover:text-foreground">
                      {d.nav}
                    </AppLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 10. Changelog + 11. Resources + 12. Support */}
      <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-border p-6">
            <p className="eyebrow">Changelog</p>
            {CHANGELOG.slice(0, 1).map((c) => (
              <div key={c.version} className="mt-4">
                <p className="font-mono text-xs text-subtle">{c.date} · v{c.version}</p>
                <h3 className="mt-1 font-medium">{c.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {c.items.slice(0, 3).map((i) => <li key={i}>{i}</li>)}
                </ul>
              </div>
            ))}
            <Link to="/docs/realmailpro/$slug" params={{ slug: "changelog" }} className="mt-5 inline-flex items-center gap-1 text-sm hover:text-volt-ink">
              All changes <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <p className="eyebrow">Resources</p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                { icon: FileJson, label: "OpenAPI 3.1 specification", to: "/resources" as const },
                { icon: Braces, label: "Postman collection", to: "/resources" as const },
                { icon: Workflow, label: "Integration examples", to: "/resources" as const },
                { icon: BookOpen, label: "Public research report", to: "/resources" as const },
              ].map((r) => (
                <li key={r.label}>
                  <Link to={r.to} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                    <r.icon className="size-4 text-volt-ink" aria-hidden /> {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-surface p-6">
            <p className="eyebrow">Support</p>
            <h3 className="mt-4 font-medium">Need help integrating?</h3>
            <p className="mt-2 text-sm text-muted-foreground">Account, billing and API access go to RealMailPro. Documentation and SDK issues go to the repository.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="sm"><Link to="/support"><LifeBuoy /> Get support</Link></Button>
              <Button asChild size="sm" variant="outline"><Link to="/support" hash="security"><ShieldCheck /> Report a vulnerability</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
