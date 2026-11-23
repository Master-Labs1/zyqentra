/** Planned layout of github.com/Zyqentra/realmailpro-api, mirrored from repository/realmailpro-api in this project. */
export const REPO_TREE: { path: string; note: string; depth: number }[] = [
  { path: "README.md", note: "Overview, quick start, verified vs unverified", depth: 0 },
  { path: "docs/", note: "Markdown guides mirrored from this portal", depth: 0 },
  { path: "openapi/openapi.yaml", note: "OpenAPI 3.1 — published endpoints only", depth: 0 },
  { path: "sdk/javascript/", note: "TypeScript client · pre-release", depth: 0 },
  { path: "sdk/python/", note: "Python client · pre-release", depth: 0 },
  { path: "examples/", note: "cURL, JavaScript, TypeScript, Python", depth: 0 },
  { path: "postman/collection.json", note: "Postman v2.1 collection", depth: 0 },
  { path: ".github/", note: "CI, CodeQL, Dependabot, templates", depth: 0 },
  { path: "SECURITY.md · CONTRIBUTING.md · LICENSE", note: "Community & policy files", depth: 0 },
];

export const SDKS = [
  {
    name: "TypeScript / JavaScript",
    pkg: "@zyqentra/realmailpro",
    path: "sdk/javascript",
    doc: "/docs/realmailpro/javascript",
    status: "Pre-release · not on npm",
    points: ["Zero runtime dependencies (uses fetch)", "Typed errors per status code", "Timeouts and GET-only retries"],
  },
  {
    name: "Python",
    pkg: "zyqentra-realmailpro",
    path: "sdk/python",
    doc: "/docs/realmailpro/python",
    status: "Pre-release · not on PyPI",
    points: ["Standard library only, Python 3.9+", "Type hints and TypedDicts", "Custom exception hierarchy"],
  },
] as const;
