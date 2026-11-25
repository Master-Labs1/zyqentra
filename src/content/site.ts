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
  /** Planned production domain. Canonical URLs point here; it is NOT claimed live until DNS + deployment are verified. */
  productionOrigin: "https://developers.zyqentra.com",
  /** Absolute social image (served from the published Lovable URL until the production domain is live). */
  socialImage: "https://zyqentra.lovable.app/__l5e/assets-v1/7ecf319c-5571-45d7-80ed-dc8d7605a8a8/zyqentra-social.png",
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
