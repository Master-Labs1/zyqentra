import { useRouter } from "@tanstack/react-router";
import { FileText, Hash, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DOCS, docPath, plainText } from "@/content/docs";
import { cn } from "@/lib/utils";

type Entry = { id: string; title: string; path: string; section: string; keywords: string; heading?: boolean };

const PAGES: Entry[] = [
  { id: "home", title: "Home", path: "/", section: "Portal", keywords: "zyqentra realmailpro" },
  { id: "api", title: "RealMailPro API overview", path: "/apis/realmailpro", section: "Portal", keywords: "status endpoints" },
  { id: "gh", title: "GitHub repository", path: "/github", section: "Portal", keywords: "sdk openapi postman repo" },
  { id: "res", title: "Resources", path: "/resources", section: "Portal", keywords: "openapi postman sdk downloads" },
  { id: "sup", title: "Support", path: "/support", section: "Portal", keywords: "help contact security" },
];

function buildIndex(): Entry[] {
  const entries: Entry[] = [];
  for (const d of DOCS) {
    const base = docPath(d.slug);
    const body = d.blocks
      .map((b) => (b.type === "p" ? plainText(b.text) : b.type === "list" ? b.items.map(plainText).join(" ") : ""))
      .join(" ")
      .slice(0, 600);
    entries.push({ id: base, title: d.title, path: base, section: d.section, keywords: `${d.description} ${body}` });
    for (const b of d.blocks) {
      if (b.type === "h2" || b.type === "h3") {
        entries.push({ id: `${base}#${b.id}`, title: b.text, path: `${base}#${b.id}`, section: d.nav, keywords: d.title, heading: true });
      }
    }
  }
  return [...entries, ...PAGES];
}

export function SearchTrigger({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const index = useMemo(buildIndex, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement))) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const groups = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const e of index) map.set(e.section, [...(map.get(e.section) ?? []), e]);
    return [...map.entries()];
  }, [index]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground",
          className,
        )}
        aria-label="Search documentation"
      >
        <Search className="size-4" />
        <span className="hidden lg:inline">Search docs</span>
        <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 font-mono text-[0.65rem] lg:inline">⌘K</kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search endpoints, errors, guides…" />
        <CommandList className="max-h-[60vh]">
          <CommandEmpty>No results. Try “otp”, “401” or “credits”.</CommandEmpty>
          {groups.map(([section, items]) => (
            <CommandGroup key={section} heading={section}>
              {items.map((e) => (
                <CommandItem
                  key={e.id}
                  value={`${e.title} ${e.section} ${e.keywords}`}
                  onSelect={() => {
                    setOpen(false);
                    router.history.push(e.path);
                  }}
                >
                  {e.heading ? <Hash className="text-muted-foreground" /> : <FileText className="text-muted-foreground" />}
                  <span className={cn(e.heading && "text-muted-foreground")}>{e.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
