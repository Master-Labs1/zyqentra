import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, CircleHelp } from "lucide-react";

import { RealMailProMark } from "@/components/brand/Logo";
import { CodeBlock } from "@/components/site/CodeBlock";
import { Inline } from "@/components/site/Prose";
import { Container, PageHero } from "@/components/site/PageHero";
import { MethodTag, StatusBadge } from "@/components/site/StatusBadge";
import { Button } from "@/components/ui/button";
import { API_STATUS_LABEL, type ApiStatus, ENDPOINTS, ERRORS, OBSERVED_401, REALMAILPRO, RESEARCH_DATE, SERVICES, UNVERIFIED_ITEMS, VERIFIED_CAPABILITIES } from "@/content/realmailpro";
import { SDKS } from "@/content/repo";
import { CHANGELOG } from "@/content/site";
import { breadcrumbLd, originFromMatches, seo } from "@/lib/seo";

export const Route = createFileRoute("/apis/realmailpro")({
  head: ({ matches }) =>
    seo({
      path: "/apis/realmailpro",
      title: "RealMailPro API — Status, Endpoints & SDKs",
      description:
        "RealMailPro API overview: verified capabilities, endpoint status, authentication, services, SDK status, changelog and support links.",
      matches,
      jsonLd: [
        breadcrumbLd(originFromMatches(matches), [
          { name: "APIs", path: "/apis" },
          { name: "RealMailPro", path: "/apis/realmailpro" },
        ]),
        { "@type": "WebAPI", name: "RealMailPro API", documentation: REALMAILPRO.docsUrl, provider: { "@type": "Organization", name: "RealMailPro", url: REALMAILPRO.website } },
      ],
    }),
  component: ApiPage,
});

const STATUS_ROWS: { area: string; status: ApiStatus; note: string }[] = [
  { area: "Endpoints & base URL", status: "requires-verification", note: "Published by RealMailPro; 401 envelope observed live; no authenticated call made yet." },
  { area: "Authentication", status: "requires-verification", note: "Bearer / X-API-Key documented; rejection of a missing key observed live; a valid key has not been tested." },
  { area: "Error codes", status: "in-progress", note: "Six codes published; only the 401 body observed." },
  { area: "Rate limits", status: "requires-verification", note: "Per-key, per-minute; numbers not published." },
  { area: "Response schemas", status: "in-progress", note: "Field names published; /services and /account/usage shapes unknown." },
  { area: "TypeScript & Python SDKs", status: "planned", note: "Sources prepared and mock-tested; not on npm or PyPI." },
  { area: "Webhooks", status: "planned", note: "Not offered by RealMailPro today; listed only as a future idea." },
];

function ApiPage() {
  return (
    <>
      <PageHero
        eyebrow="APIs / RealMailPro"
        title="RealMailPro API"
        aside={
          <div className="flex flex-col items-start gap-3 md:items-end">
            <StatusBadge status="in-progress" />
            <span className="font-mono text-xs text-muted-foreground">Researched {RESEARCH_DATE}</span>
          </div>
        }
      >
        <p>Create temporary inboxes, receive verification emails and read OTP codes from your own code.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild><Link to="/docs/realmailpro/$slug" params={{ slug: "getting-started" }}>Get started <ArrowRight /></Link></Button>
          <Button asChild variant="outline"><a href={REALMAILPRO.developerApiUrl} target="_blank" rel="noopener noreferrer">Get an API key ↗</a></Button>
        </div>
      </PageHero>

      <Container className="space-y-20 py-16">
        <section className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Verified capabilities</h2>
            <ul className="mt-6 space-y-4">
              {VERIFIED_CAPABILITIES.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-sm text-muted-foreground"><Inline text={c.text} /></p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Not yet verified</h2>
            <ul className="mt-6 space-y-3">
              {UNVERIFIED_ITEMS.map((u) => (
                <li key={u} className="flex gap-3 text-sm text-muted-foreground">
                  <CircleHelp className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Documentation status</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60">
                <tr>
                  {["Area", "Status", "Notes"].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-mono text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {STATUS_ROWS.map((r) => (
                  <tr key={r.area}>
                    <td className="px-5 py-3 font-medium">{r.area}</td>
                    <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Legend: {(Object.keys(API_STATUS_LABEL) as ApiStatus[]).map((k) => API_STATUS_LABEL[k]).join(" · ")}. Nothing is labelled available unless it has been observed working.
          </p>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Authentication</h2>
            <p className="mt-3 text-muted-foreground">Send your key on every request. Keys are created in your RealMailPro dashboard after a first deposit of ${REALMAILPRO.minDepositUsd}; up to {REALMAILPRO.maxActiveKeys} can be active.</p>
            <CodeBlock className="mt-5" tabs={[{ label: "Header", lang: "bash", code: "Authorization: Bearer YOUR_API_KEY" }, { label: "Observed 401", lang: "json", code: OBSERVED_401 }]} />
            <Link to="/docs/realmailpro/$slug" params={{ slug: "authentication" }} className="mt-4 inline-flex items-center gap-1 text-sm hover:text-volt-ink">Authentication guide <ArrowRight className="size-3.5" /></Link>
          </div>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Services</h2>
            <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
              {SERVICES.map((s) => (
                <li key={s.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-medium">{s.label}</p>
                    <code className="font-mono text-xs text-muted-foreground">{s.id}</code>
                  </div>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{s.credits} credit{s.credits > 1 ? "s" : ""}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">$1 = 1,000 credits. Prices from RealMailPro's Developer API page.</p>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight">API reference</h2>
            <Link to="/docs/realmailpro/$slug" params={{ slug: "api-reference" }} className="inline-flex items-center gap-1 text-sm hover:text-volt-ink">Full reference <ArrowRight className="size-3.5" /></Link>
          </div>
          <ul className="mt-6 divide-y divide-border rounded-2xl border border-border">
            {ENDPOINTS.map((e) => (
              <li key={e.id} className="grid gap-2 px-5 py-4 md:grid-cols-[auto_minmax(0,16rem)_1fr_auto] md:items-center md:gap-5">
                <MethodTag method={e.method} />
                <code className="font-mono text-sm">{e.path}</code>
                <span className="text-sm text-muted-foreground">{e.description}</span>
                <span className="font-mono text-xs text-subtle">{e.cost}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold">Errors</h2>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              {ERRORS.map((e) => <li key={e.code} className="flex gap-3"><span className="text-warning">{e.status}</span><span className="text-muted-foreground">{e.code}</span></li>)}
            </ul>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold">SDK status</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {SDKS.map((s) => <li key={s.name}><p className="font-medium">{s.name}</p><p className="text-muted-foreground">{s.status}</p></li>)}
            </ul>
            <Link to="/github" className="mt-4 inline-flex items-center gap-1 text-sm hover:text-volt-ink">Repository <ArrowRight className="size-3.5" /></Link>
          </div>
          <div className="rounded-2xl border border-border p-6">
            <h2 className="font-semibold">Changelog</h2>
            {CHANGELOG.map((c) => <p key={c.version} className="mt-4 text-sm"><span className="font-mono text-xs text-subtle">{c.date}</span><br />{c.title}</p>)}
            <Link to="/support" className="mt-4 inline-flex items-center gap-1 text-sm hover:text-volt-ink">Support <ArrowRight className="size-3.5" /></Link>
          </div>
        </section>

        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <RealMailProMark className="text-xs" /> is operated by its owner at realmailpro.online. Zyqentra documents it; the service itself is not open source.
        </p>
      </Container>
    </>
  );
}
