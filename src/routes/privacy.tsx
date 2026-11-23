import { createFileRoute } from "@tanstack/react-router";

import { Container, PageHero } from "@/components/site/PageHero";
import { REALMAILPRO } from "@/content/realmailpro";
import { SITE } from "@/content/site";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: ({ matches }) =>
    seo({
      path: "/privacy",
      title: "Privacy",
      description: "How the Zyqentra developer portal handles data: no accounts, no tracking cookies, one local theme preference.",
      matches,
    }),
  component: Privacy,
});

function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy">Last updated 2026-11-23.</PageHero>
      <Container className="max-w-3xl py-14">
        <div className="space-y-8 leading-7 text-muted-foreground [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground">
          <section><h2>What this portal collects</h2><p>The Zyqentra portal has no accounts, forms, analytics scripts or advertising. It does not set tracking cookies.</p></section>
          <section><h2>Stored on your device</h2><p>Your light/dark theme choice is saved in your browser's local storage under <code className="font-mono text-foreground">zq-theme</code>. It never leaves your device.</p></section>
          <section><h2>Hosting</h2><p>Like any website, the hosting provider may process standard request data (such as IP address and user agent) to deliver pages and protect against abuse.</p></section>
          <section><h2>Fonts</h2><p>Typefaces are loaded from Google Fonts, which receives standard request data when the page loads.</p></section>
          <section><h2>RealMailPro</h2><p>Using the RealMailPro API or website is governed by RealMailPro's own <a className="underline underline-offset-4 hover:text-foreground" href={REALMAILPRO.privacyUrl} target="_blank" rel="noopener noreferrer">privacy policy</a>. This portal never asks for or stores your API key.</p></section>
          <section><h2>Contact</h2><p>Questions: <a className="font-mono underline underline-offset-4 hover:text-foreground" href={`mailto:${SITE.securityEmail}`}>{SITE.securityEmail}</a></p></section>
        </div>
      </Container>
    </>
  );
}
