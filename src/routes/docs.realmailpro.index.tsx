import { createFileRoute } from "@tanstack/react-router";

import { DocsShell } from "@/components/docs/DocsShell";
import { getDoc } from "@/content/docs";
import { breadcrumbLd, originFromMatches, seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/realmailpro/")({
  head: ({ matches }) =>
    seo({
      path: "/docs/realmailpro",
      title: "RealMailPro API Documentation",
      description:
        "RealMailPro REST API docs: create temporary Gmail.com and Outlook.com inboxes, read OTP codes, authenticate with API keys and handle errors.",
      matches,
      type: "article",
      jsonLd: [
        breadcrumbLd(originFromMatches(matches), [
          { name: "Docs", path: "/docs" },
          { name: "RealMailPro", path: "/docs/realmailpro" },
        ]),
      ],
    }),
  component: () => {
    const page = getDoc("");
    return page ? <DocsShell page={page} /> : null;
  },
});
