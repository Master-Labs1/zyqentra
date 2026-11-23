import { createFileRoute } from "@tanstack/react-router";

import { LogoMark, RealMailProMark } from "@/components/brand/Logo";
import { Container, PageHero } from "@/components/site/PageHero";
import { SITE } from "@/content/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: ({ matches }) =>
    seo({
      path: "/about",
      title: "About Zyqentra",
      description: "Zyqentra is the developer ecosystem for RealMailPro: documentation, SDK sources and integration tooling built on verified information.",
      matches,
    }),
  component: About,
});

const PRINCIPLES = [
  { t: "Verified over impressive", d: "Every API fact links back to RealMailPro's public docs or a live observation. Unknowns are labelled, not invented." },
  { t: "One product, done well", d: "Zyqentra documents RealMailPro only — no marketplace, no unrelated APIs." },
  { t: "Secure by default", d: "Keys from environment variables, server-side calls, no credentials in examples or repositories." },
  { t: "Open where it should be", d: "SDKs and examples are MIT. The RealMailPro service and its backend remain proprietary." },
];

function About() {
  return (
    <>
      <PageHero eyebrow="About" title="Build beyond limits.">
        Zyqentra is the parent developer identity. RealMailPro is the one product it features.
      </PageHero>
      <Container className="grid gap-14 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-8">
          <div className="flex items-center gap-6 rounded-2xl border border-border bg-surface p-8">
            <LogoMark className="size-16" />
            <div>
              <p className="font-mono text-lg font-semibold tracking-[0.22em]">ZYQENTRA</p>
              <p className="eyebrow mt-1">{SITE.tagline}</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            The mark is a “Z” whose top bar stops short, leaving one cell that has already moved past the edge of the grid. It stands for the ecosystem's job: take a solid product and give developers what they need to go further with it.
          </p>
          <div className="flex items-center gap-3 rounded-2xl border border-border p-5 text-sm text-muted-foreground">
            <RealMailProMark className="text-foreground" /> appears in its own signal colour so the product is never confused with the parent brand.
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Principles</h2>
          <dl className="mt-6 divide-y divide-border rounded-2xl border border-border">
            {PRINCIPLES.map((p) => (
              <div key={p.t} className="p-6">
                <dt className="font-medium">{p.t}</dt>
                <dd className="mt-1.5 text-sm text-muted-foreground">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </>
  );
}
