# Zyqentra

**Developer infrastructure for RealMailPro.**

Zyqentra brings RealMailPro API documentation, integration guidance, SDK source, and developer resources together in one focused portal.

[Open the developer portal](https://developers.zyqentra.com) · [RealMailPro](https://realmailpro.online) · [API repository](https://github.com/Zyqentra/realmailpro-api)

> **Project status:** This repository contains the Zyqentra developer portal. The canonical production domain is configured as `developers.zyqentra.com`; deployment and domain availability should be verified before treating it as live.

## What’s inside

- Product and API overview pages for RealMailPro.
- Searchable documentation and integration resources.
- TypeScript and Python SDK source references.
- Downloadable OpenAPI and Postman resources.
- Responsive layouts, accessible navigation, and light/dark themes.
- SEO metadata, canonical URLs, sitemap, and robots directives.

API details are presented according to published RealMailPro material. Where a detail has not been verified, the documentation identifies it rather than inventing a production capability.

## Technology

- React 19 and TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS 4
- Vitest and Testing Library

## Getting started

### Requirements

- [Bun](https://bun.sh/) (the repository includes `bun.lock`)
- Node.js 20 or newer

### Install and run

```bash
bun install
bun run dev
```

Vite prints the local development URL after the server starts.

### Available commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the local development server |
| `bun run build` | Create a production build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run test` | Run the Vitest suite |
| `bun run format` | Format repository files with Prettier |

## Project structure

```text
src/
  components/       Shared site, documentation, and UI components
  content/          Navigation, site metadata, and documentation content
  lib/              SEO, runtime helpers, and shared utilities
  routes/           TanStack file-based routes
  test/             Application tests and test setup
public/             Static assets and downloadable API resources
repository/         Supporting repository and organization materials
```

## Configuration and security

The portal is designed to serve public documentation. Do not place API credentials, private customer data, or production secrets in client-side code or committed files. If a future feature requires credentials, keep them server-side and use the deployment platform’s secret manager.

The repository’s canonical origin is maintained in `src/content/site.ts`. Update that value only when the production domain and deployment are confirmed. Preview hosts should remain non-indexable.

## Documentation and API resources

The portal links to RealMailPro’s public product documentation and to the API resource files in `public/downloads/`. The downloadable copies are checked against the maintained files in `repository/realmailpro-api`; when updating a specification or collection, update both locations and run the download consistency tests.

## Quality checks

Before submitting a change, run:

```bash
bun run lint
bun run test
bun run build
```

The repository also includes focused checks for application routing and downloadable API files. Report test results only after running the relevant commands.

## Contributing

1. Create a focused branch for your change.
2. Keep API claims aligned with verifiable public specifications.
3. Include or update tests when behavior changes.
4. Run lint, tests, and a production build.
5. Open a pull request with a concise summary and validation notes.

Do not include credentials, private backend code, or unverified production claims in contributions.

## Support

For RealMailPro product and API questions, use the support channels published at [realmailpro.online](https://realmailpro.online). For portal issues, open an issue in this repository when repository access allows.

## Brand and ownership

Zyqentra is the developer ecosystem. RealMailPro is the featured product and service. Product names, logos, and services remain subject to their respective owners’ rights and terms.
