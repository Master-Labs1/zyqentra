import { createFileRoute } from "@tanstack/react-router";

import { Container, PageHero } from "@/components/site/PageHero";
import { REALMAILPRO } from "@/content/realmailpro";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: ({ matches }) =>
    seo({
      path: "/terms",
      title: "Terms",
      description: "Terms for using the Zyqentra developer portal, its documentation, SDK sources and examples.",
      matches,
    }),
  component: Terms,
});

function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms">Last updated 2026-11-23.</PageHero>
      <Container className="max-w-3xl py-14">
        <div className="space-y-8 leading-7 text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
          <section><h2>Documentation</h2><p>Documentation is provided as-is for information. It is written from RealMailPro's public materials and may lag behind changes to the service. Items marked “needs verification” are not confirmed.</p></section>
          <section><h2>Code</h2><p>SDK source code and examples are licensed under the MIT License. They are pre-release and come without warranty.</p></section>
          <section><h2>The RealMailPro service</h2><p>Access to the RealMailPro API, pricing, billing and acceptable use are governed by RealMailPro's <a className="underline underline-offset-4 hover:text-foreground" href={REALMAILPRO.termsUrl} target="_blank" rel="noopener noreferrer">terms of service</a>. Use the API only for inboxes and accounts you own or are authorised to test.</p></section>
          <section><h2>Trademarks</h2><p>RealMailPro and its logo belong to their owner. Zyqentra and its logo are Zyqentra's. Neither is licensed under the MIT License.</p></section>
          <section><h2>Changes</h2><p>These terms may be updated; the date above shows the latest revision.</p></section>
        </div>
      </Container>
    </>
  );
}
