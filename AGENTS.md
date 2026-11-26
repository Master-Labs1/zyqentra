Engineering Standards

This project follows a structured, maintainable, and production-oriented software engineering approach.

Architecture & Code Quality

- Maintain clean, modular, scalable and maintainable code.
- Follow established React, TypeScript and modern web development conventions.
- Use reusable components and clear separation of concerns.
- Avoid unnecessary dependencies, duplicated logic and temporary workarounds.
- Preserve existing functionality when implementing changes.

SEO & Domain Configuration

- Canonical URLs, sitemap and JSON-LD must always use "SITE.productionOrigin".
- Search engine indexing must be enabled only for the production domain.
- Preview and development environments must remain excluded from indexing.
- Maintain accurate metadata, structured data and canonical references.

Repository & API Documentation

- The "repository/" directory contains source files intended for public GitHub distribution and is excluded from the application build.
- "public/downloads/*" must remain synchronized with their corresponding files in "repository/realmailpro-api".
- After modifying API specifications or Postman collections, update their downloadable copies.
- Always run "src/test/downloads.test.ts" to verify synchronization.
- Keep API documentation, examples and SDK instructions accurate and consistent.

Security & Configuration

- Never expose private credentials, API keys or service-role keys in client-side code.
- Keep environment variables and secrets outside version control.
- Follow secure authentication, authorization and data-handling practices.
- Validate external inputs and handle errors safely.

Testing & Releases

- Run relevant tests after every significant change.
- Resolve TypeScript errors and build failures before releases.
- Avoid breaking changes without proper documentation.
- Keep the main branch stable and functional.
- Never rewrite published Git history or force-push without explicit authorization.

Development Principles

- Prioritize reliability, security, performance and accessibility.
- Make changes only when they provide measurable value.
- Do not fabricate features, API capabilities, test results or production readiness.
- Document limitations and unverified functionality transparently.
