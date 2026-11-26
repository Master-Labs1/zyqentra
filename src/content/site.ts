export const SITE = {
  name: "Zyqentra",
  tagline: "BUILD BEYOND LIMITS.",
  description:
    "Zyqentra is the developer ecosystem for RealMailPro: API documentation, integration guides, SDK sources and tools.",
  githubOrg: "Zyqentra",
  githubRepo: "realmailpro-api",
  githubUrl: "https://github.com/Zyqentra/realmailpro-api",
  securityEmail: "support@realmailpro.online",
  portalVersion: "0.1.0",
  /** Repository is prepared but private; never link to it as public until the owner approves. */
  repoVisibility: "private-pending" as "private-pending" | "public",
  license: "MIT",
  /** Planned production domain; verify DNS and deployment before describing it as live. */
  productionOrigin: "https://developers.zyqentra.com",
  socialImage: "https://developers.zyqentra.com/og-image.svg",
} as const;

export const NAV = [
  { to: "/docs/realmailpro", label: "Docs" },
  { to: "/apis/realmailpro", label: "API" },
  { to: "/github", label: "GitHub" },
  { to: "/resources", label: "Resources" },
  { to: "/support", label: "Support" },
] as const;

export const CHANGELOG: { date: string; version: string; title: string; items: string[] }[] = [
  {
    date: "2026-11-23",
    version: "0.1.0",
    title: "Initial developer portal",
    items: [
      "Documented the six endpoints published at realmailpro.online/docs (v1 base URL).",
      "Added error, authentication and credit reference from RealMailPro's public pages.",
      "Prepared TypeScript and Python SDK sources, OpenAPI 3.1 spec and Postman collection (not published to npm or PyPI).",
      "Marked every unpublished detail — schemas, rate-limit numbers, pagination — as needs verification.",
    ],
  },
];
