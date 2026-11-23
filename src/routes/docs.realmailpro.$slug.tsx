import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocsShell } from "@/components/docs/DocsShell";
import { docPath, getDoc } from "@/content/docs";
import { breadcrumbLd, originFromMatches, seo } from "@/lib/seo";

export const Route = createFileRoute("/docs/realmailpro/$slug")({
  loader: ({ params }) => {
    const page = getDoc(params.slug);
    if (!page || !params.slug) throw notFound();
    return { slug: page.slug };
  },
  head: ({ loaderData, matches }) => {
    const page = loaderData ? getDoc(loaderData.slug) : undefined;
    if (!page) return { meta: [{ title: "Page not found · Zyqentra" }, { name: "robots", content: "noindex" }] };
    const origin = originFromMatches(matches);
    const path = docPath(page.slug);
    return seo({
      path,
      title: `${page.title} — RealMailPro API`,
      description: page.description,
      matches,
      type: "article",
      noindex: !page.indexable,
      jsonLd: [
        breadcrumbLd(origin, [
          { name: "Docs", path: "/docs" },
          { name: "RealMailPro", path: "/docs/realmailpro" },
          { name: page.nav, path },
        ]),
        { "@type": "TechArticle", headline: page.title, description: page.description, dateModified: page.updated, publisher: { "@type": "Organization", name: "Zyqentra" } },
      ],
    });
  },
  component: DocRoute,
});

function DocRoute() {
  const { slug } = Route.useLoaderData();
  const page = getDoc(slug);
  if (!page) return null;
  return <DocsShell page={page} />;
}
