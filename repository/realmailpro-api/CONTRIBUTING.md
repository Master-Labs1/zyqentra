# Contributing

Thanks for helping improve the RealMailPro developer kit.

## Ground rules

1. **No unverified API claims.** Every endpoint, field, limit or behaviour must cite RealMailPro's public docs
   (<https://realmailpro.online/docs>) or a reproducible observation. Otherwise mark it `NEEDS VERIFICATION`.
2. **No secrets.** Never commit API keys, `.env` files, real inbox addresses or message contents. Use `YOUR_API_KEY`.
3. **No backend code.** This repository describes the public API only.

## Development

```bash
# TypeScript SDK
cd sdk/javascript && npm install && npm run typecheck && npm test

# Python SDK
cd sdk/python && python -m unittest discover -s tests -v

# OpenAPI
npx @redocly/cli lint openapi/openapi.yaml
```

Tests must not call the live API.

## Pull requests

- One logical change per PR, with tests for SDK changes.
- Update `CHANGELOG.md` under **Unreleased**.
- Fill in the PR template, including the verification checklist.

## Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking SDK API changes (renamed methods, changed return types).
- **MINOR** — new endpoints or options, backwards compatible.
- **PATCH** — fixes and documentation corrections.

While the version is `0.x`, minor releases may include breaking changes; they are called out in the changelog.
SDK packages and the OpenAPI document are versioned together. Publishing to npm or PyPI requires owner approval.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
