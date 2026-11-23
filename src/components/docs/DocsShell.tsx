import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronRight, PanelLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { RealMailProMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DOCS, DOC_SECTIONS, DOC_STATUS_LABEL, type DocPage, docPath, getNeighbors } from "@/content/docs";
import { REALMAILPRO } from "@/content/realmailpro";
import { cn } from "@/lib/utils";

import { AppLink } from "@/components/site/AppLink";

import { DocBlocks } from "./DocBlocks";

function SidebarNav({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation" className="space-y-7 text-sm">
      {DOC_SECTIONS.map((section) => (
        <div key={section}>
          <p className="eyebrow mb-2 px-3">{section}</p>
          <ul className="space-y-0.5">
            {DOCS.filter((d) => d.section === section).map((d) => {
              const active = d.slug === current;
              return (
                <li key={d.slug}>
                  <AppLink
                    href={docPath(d.slug)}
                    onClick={() => onNavigate?.()}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center justify-between rounded-md px-3 py-1.5 transition-colors",
                      active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-volt" aria-hidden />}
                    {d.nav}
                    {d.status === "prerelease" && <span className="font-mono text-[0.6rem] uppercase text-subtle">pre</span>}
                  </AppLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Toc({ page }: { page: DocPage }) {
  const headings = page.blocks.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((e): e is HTMLElement => !!e);
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    els.forEach((e) => obs.observe(e));
    return () => obs.disconnect();
  }, [page.slug]); // eslint-disable-line react-hooks/exhaustive-deps
  if (headings.length < 2) return null;
  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-2 border-l border-border">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={cn(
                "-ml-px block border-l pl-3 transition-colors",
                active === h.id ? "border-volt-ink text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DocsShell({ page }: { page: DocPage }) {
  const [open, setOpen] = useState(false);
  const { prev, next } = getNeighbors(page.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_200px]">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-2 lg:block">
          <div className="mb-6 px-3">
            <RealMailProMark className="text-sm" />
            <p className="mt-1 font-mono text-[0.7rem] text-muted-foreground">API {REALMAILPRO.apiVersion} · docs 0.1.0</p>
          </div>
          <SidebarNav current={page.slug} />
        </aside>

        <article className="min-w-0 py-8 lg:py-10">
          <div className="mb-6 flex items-center gap-2 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <PanelLeft /> Docs menu
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto border-border bg-background">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <RealMailProMark className="text-sm" />
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <SidebarNav current={page.slug} onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <li><Link to="/docs" className="hover:text-foreground">Docs</Link></li>
              <li aria-hidden><ChevronRight className="size-3" /></li>
              <li><Link to="/docs/realmailpro" className="hover:text-foreground">RealMailPro</Link></li>
              {page.slug && (
                <>
                  <li aria-hidden><ChevronRight className="size-3" /></li>
                  <li aria-current="page" className="text-foreground">{page.nav}</li>
                </>
              )}
            </ol>
          </nav>

          <header className="mb-8 space-y-3 border-b border-border pb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{page.section}</span>
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
                  page.status === "source" && "border-success/30 text-success",
                  page.status === "partial" && "border-warning/30 text-warning",
                  page.status === "prerelease" && "border-info/30 text-info",
                )}
              >
                {DOC_STATUS_LABEL[page.status]}
              </span>
            </div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">{page.title}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{page.description}</p>
          </header>

          <DocBlocks blocks={page.blocks} />

          <footer className="mt-14 space-y-6 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              Last updated {page.updated} · Source:{" "}
              <a href={REALMAILPRO.docsUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
                realmailpro.online/docs
              </a>
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <AppLink href={docPath(prev.slug)} className="group rounded-xl border border-border p-4 transition-colors hover:border-foreground/25">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="size-3" /> Previous</span>
                  <span className="mt-1 block font-medium">{prev.nav}</span>
                </AppLink>
              ) : <span />}
              {next && (
                <AppLink href={docPath(next.slug)} className="group rounded-xl border border-border p-4 text-right transition-colors hover:border-foreground/25">
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground">Next <ArrowRight className="size-3" /></span>
                  <span className="mt-1 block font-medium">{next.nav}</span>
                </AppLink>
              )}
            </div>
          </footer>
        </article>

        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] overflow-y-auto py-10 xl:block">
          <Toc page={page} />
        </aside>
      </div>
    </div>
  );
}
