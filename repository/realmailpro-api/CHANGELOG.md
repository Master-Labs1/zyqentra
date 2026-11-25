# Changelog

All notable changes to this repository are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/).

This file tracks the docs, SDKs and tooling in this repository — not changes to the RealMailPro service.

## [Unreleased]

### Added
- GitHub Actions: CI (TypeScript, Python 3.9/3.12, OpenAPI lint, Postman JSON, Markdown links), CodeQL, dependency review; Dependabot config.
- Issue templates (bug, feature, docs correction), PR template, `RELEASING.md`, `.env.example`.
- SDK READMEs, README banner, architecture and workflow diagrams, social preview image.

## [0.1.0] - 2026-11-23

### Added
- Documentation for the six endpoints published at <https://realmailpro.online/docs>.
- OpenAPI 3.1 description with unpublished details marked NEEDS VERIFICATION.
- Pre-release TypeScript SDK (`sdk/javascript`) and Python SDK (`sdk/python`) with unit tests against a mocked API.
- Postman v2.1 collection, cURL/JavaScript/TypeScript/Python examples.

### Not yet verified
- Successful authenticated responses, rate-limit values, `/services` and `/account/usage` schemas.
