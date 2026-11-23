import { cn } from "@/lib/utils";

/**
 * Zyqentra mark: a "Z" whose top bar ends early, with a detached cell that has
 * already crossed the edge of the grid — "build beyond limits".
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d="M4 5h16v5L11 22h17v5H4v-5l9-12H4z" fill="currentColor" />
      <rect x="22.5" y="5" width="5.5" height="5" rx="1" className="fill-volt" />
    </svg>
  );
}

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-foreground", className)}>
      <LogoMark className="size-6" />
      {!compact && (
        <span className="font-mono text-[0.95rem] font-semibold tracking-[0.22em]">ZYQENTRA</span>
      )}
    </span>
  );
}

/** RealMailPro product chip — Zyqentra stays the parent identity, the product carries the signal colour. */
export function RealMailProMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
        <rect x="2" y="5" width="20" height="14" rx="3" className="fill-signal/15 stroke-signal" strokeWidth="1.5" />
        <path d="M3.5 7.5 12 13l8.5-5.5" className="stroke-signal" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-semibold tracking-tight">RealMailPro</span>
    </span>
  );
}
