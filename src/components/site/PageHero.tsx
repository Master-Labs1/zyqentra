import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, children, aside }: { eyebrow: string; title: string; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10 bg-grid mask-fade-b opacity-70" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-end md:justify-between lg:py-20">
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
          {children && <div className="text-lg text-muted-foreground">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}
