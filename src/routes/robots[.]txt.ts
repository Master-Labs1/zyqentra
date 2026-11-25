import { createFileRoute } from "@tanstack/react-router";

import { SITE } from "@/content/site";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const isProduction = new URL(request.url).origin === SITE.productionOrigin;
        // Preview and temporary hosts must never be indexed as production pages.
        const body = isProduction
          ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.productionOrigin}/sitemap.xml\n`
          : "User-agent: *\nDisallow: /\n";
        return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
