import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, CreditCard, Github, ShieldAlert } from "lucide-react";

import { Container, PageHero } from "@/components/site/PageHero";
import { REALMAILPRO } from "@/content/realmailpro";
import { SITE } from "@/content/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/support")({
  head: ({ matches }) =>
    seo({
      path: "/support",
      title: "Support",
      description: "Where to get help with the RealMailPro API: account and billing, documentation issues, and private security reports.",
      matches,
    }),
  component: Support,
});

function Support() {
  return (
    <>
      <PageHero eyebrow="Support" title="Get the right help, fast.">
        Pick the channel that matches your question.
      </PageHero>
      <Container className="grid gap-5 py-16 md:grid-cols-2">
        <div className="rounded-2xl border border-border p-6">
          <CreditCard className="size-5 text-volt-ink" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold">Account, billing &amp; API keys</h2>
          <p className="mt-2 text-sm text-muted-foreground">Deposits, credits, key creation, suspended accounts and service outages are handled by RealMailPro.</p>
          <a href={REALMAILPRO.contactUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">RealMailPro contact page ↗</a>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <BookOpen className="size-5 text-volt-ink" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold">Integration questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Most answers are in the docs — start with troubleshooting and the FAQ.</p>
          <div className="mt-4 flex gap-4 text-sm font-medium">
            <Link to="/docs/realmailpro/$slug" params={{ slug: "troubleshooting" }} className="underline underline-offset-4">Troubleshooting</Link>
            <Link to="/docs/realmailpro/$slug" params={{ slug: "faq" }} className="underline underline-offset-4">FAQ</Link>
          </div>
        </div>
        <div className="rounded-2xl border border-border p-6">
          <Github className="size-5 text-volt-ink" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold">Docs &amp; SDK issues</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Wrong or unclear docs, SDK bugs and feature requests go to the {SITE.githubRepo} repository's issue tracker once it is public.
          </p>
          <Link to="/github" className="mt-4 inline-block text-sm font-medium underline underline-offset-4">Repository status</Link>
        </div>
        <div id="security" className="scroll-mt-24 rounded-2xl border border-warning/30 bg-warning/5 p-6">
          <ShieldAlert className="size-5 text-warning" aria-hidden />
          <h2 className="mt-4 text-lg font-semibold">Report a security issue</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please report vulnerabilities privately — never in a public issue. Include steps to reproduce and the affected component. Do not include real API keys.
          </p>
          <a href={`mailto:${SITE.securityEmail}?subject=Security%20report`} className="mt-4 inline-block font-mono text-sm underline underline-offset-4">{SITE.securityEmail}</a>
        </div>
      </Container>
    </>
  );
}
