import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { RealMailProMark } from "@/components/brand/Logo";
import { Container, PageHero } from "@/components/site/PageHero";
import { StatusBadge } from "@/components/site/StatusBadge";
import { ENDPOINTS, REALMAILPRO } from "@/content/realmailpro";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/apis/")({
  head: ({ matches }) =>
    seo({
      path: "/apis",
      title: "APIs",
      description: "API directory of the Zyqentra developer ecosystem. Zyqentra documents one product: the RealMailPro API.",
      matches,
    }),
  component: Apis,
});

function Apis() {
  return (
    <>
      <PageHero eyebrow="API directory" title="One product. Documented properly.">
        Zyqentra focuses on a single API instead of a marketplace. Every detail shown here traces back to RealMailPro's public documentation.
      </PageHero>
      <Container className="py-14">
        <Link to="/apis/realmailpro" className="group grid gap-6 rounded-2xl border border-border bg-card p-8 shadow-card transition-colors hover:border-foreground/25 md:grid-cols-[1fr_auto] md:items-center">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <RealMailProMark className="text-xl" />
              <StatusBadge status="in-progress" />
            </div>
            <p className="max-w-2xl text-muted-foreground">
              Temporary Gmail.com and Outlook.com inboxes with OTP detection, billed with prepaid credits. {ENDPOINTS.length} published endpoints, Bearer key authentication.
            </p>
            <code className="font-mono text-xs text-subtle">{REALMAILPRO.baseUrl}</code>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:text-volt-ink">
            View API <ArrowRight className="size-4" />
          </span>
        </Link>
      </Container>
    </>
  );
}
