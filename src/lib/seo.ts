import { SITE } from "@/content/site";

type MatchLike = { loaderData?: unknown };

export function originFromMatches(matches: MatchLike[]): string {
  const data = matches[0]?.loaderData as { origin?: string } | undefined;
  return data?.origin ?? "";
}

type SeoInput = {
  path: string;
  title: string;
  description: string;
  matches: MatchLike[];
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>[];
};

/** Builds per-route head(): unique title/description, OG/Twitter, canonical and optional JSON-LD. */
export function seo({ path, title, description, matches, noindex, type = "website", jsonLd }: SeoInput) {
  const servingOrigin = originFromMatches(matches);
  const origin = SITE.productionOrigin;
  // Preview / temporary hosts are never indexed; only the production domain is.
  const isProduction = servingOrigin === "" || servingOrigin === SITE.productionOrigin;
  const fullTitle = path === "/" ? title : `${title} · ${SITE.name}`;
  const canonical = `${origin}${path}`;
  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
    { property: "og:image", content: SITE.socialImage },
    { name: "twitter:image", content: SITE.socialImage },
    { property: "og:image:alt", content: "Zyqentra — RealMailPro API developer kit" },
  ];
  if (canonical) meta.push({ property: "og:url", content: canonical });
  if (noindex || !isProduction) meta.push({ name: "robots", content: "noindex, follow" });
  return {
    meta,
    links: canonical ? [{ rel: "canonical", href: canonical }] : [],
    scripts: (jsonLd ?? []).map((data) => ({
      type: "application/ld+json",
      children: JSON.stringify({ "@context": "https://schema.org", ...data }),
    })),
  };
}

export function breadcrumbLd(_servingOrigin: string, items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE.productionOrigin}${it.path}`,
    })),
  };
}
