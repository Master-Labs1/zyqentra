import { createFileRoute } from "@tanstack/react-router";

import { DOCS, docPath } from "@/content/docs";
import { SITE } from "@/content/site";

const STATIC = ["/", "/apis", "/apis/realmailpro", "/docs", "/github", "/resources", "/support", "/about", "/privacy", "/terms"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE.productionOrigin;
        // Pre-release pages (noindex) are left out so placeholders are not indexed as finished docs.
        const paths = [...STATIC, ...DOCS.filter((d) => d.indexable).map((d) => docPath(d.slug))];
        const urls = paths
          .map((p) => `  <url><loc>${origin}${p}</loc><lastmod>2026-11-23</lastmod></url>`)
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
