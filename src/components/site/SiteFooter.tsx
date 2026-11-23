import { Logo } from "@/components/brand/Logo";
import { AppLink } from "@/components/site/AppLink";
import { REALMAILPRO } from "@/content/realmailpro";
import { SITE } from "@/content/site";

const COLS = [
  {
    title: "Documentation",
    links: [
      { to: "/docs/realmailpro", label: "Overview" },
      { to: "/docs/realmailpro/getting-started", label: "Getting started" },
      { to: "/docs/realmailpro/api-reference", label: "API reference" },
      { to: "/docs/realmailpro/errors", label: "Errors" },
      { to: "/docs/realmailpro/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Developers",
    links: [
      { to: "/apis/realmailpro", label: "API status" },
      { to: "/github", label: "GitHub repository" },
      { to: "/resources", label: "Resources" },
      { to: "/docs/realmailpro/postman", label: "Postman" },
    ],
  },
  {
    title: "Zyqentra",
    links: [
      { to: "/about", label: "About" },
      { to: "/support", label: "Support" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            The developer ecosystem for RealMailPro. Documentation, SDK sources and integration resources.
          </p>
          <p className="eyebrow">{SITE.tagline}</p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h2 className="mb-3 text-sm font-medium">{c.title}</h2>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.to}>
                  <AppLink href={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {l.label}
                  </AppLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 Zyqentra. SDK and example code: MIT. RealMailPro and its service are proprietary to their owner.</p>
          <a href={REALMAILPRO.website} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
            realmailpro.online ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
