# Changelog

All notable changes to this repository are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versioning: [SemVer](https://semver.org/).

This file tracks the docs, SDKs and tooling in this repository — not changes to the RealMailPro service.

## [Unreleased]

## [0.1.0] - 2026-11-23

### Added
- Documentation for the six endpoints published at <https://realmailpro.online/docs>.
- OpenAPI 3.1 description with unpublished details marked NEEDS VERIFICATION.
- Pre-release TypeScript SDK (`sdk/javascript`) and Python SDK (`sdk/python`) with unit tests against a mocked API.
- Postman v2.1 collection, cURL/JavaScript/TypeScript/Python examples.
- CI (tests, type check, OpenAPI lint, JSON validation, link check), CodeQL and Dependabot.

### Not yet verified
- Successful authenticated responses, rate-limit values, `/services` and `/account/usage` schemas.
