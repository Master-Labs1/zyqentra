# Security Policy

## Scope

This policy covers the **SDKs, examples, OpenAPI document and docs in this repository**.

Vulnerabilities in the **RealMailPro service itself** (the API, website or accounts) should also be reported privately
to the same address below — please do not test against other users' data.

## Reporting a vulnerability

- **Preferred:** open a private report via GitHub → **Security** → **Report a vulnerability** (once the repository is public).
- **Email:** **support@realmailpro.online** with the subject "Security report".

Please include the affected component and version, steps to reproduce, and impact. **Never include real API keys** —
if a key was exposed, revoke it in your RealMailPro dashboard first.

Do not open public issues for security problems.

## What to expect

- Acknowledgement of your report.
- An assessment and, where valid, a fix and a changelog entry crediting you if you wish.

No response-time guarantees are offered at this stage.

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x (pre-release) | ✅ |

## Repository hygiene

- No credentials, `.env` files, customer data or RealMailPro backend code are stored here.
- CodeQL and Dependabot run on this repository.
