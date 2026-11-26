# Developer outreach plan — drafts for owner review (nothing published)

Research date 2026-11-24. Verdicts are based on each platform's published rules (links below). No accounts, posts, issues or PRs were created.

| Channel | Verdict | Why |
|---|---|---|
| public-apis/public-apis | Not eligible | Requires a free tier for API access ([CONTRIBUTING](https://github.com/public-apis/public-apis/blob/HEAD/CONTRIBUTING.md)); the API is prepaid. |
| APIs.guru | After a stable public spec URL | Needs a permanent definition URL ([add-api](https://apis.guru/add-api)); paid APIs allowed. |
| Postman Public API Network | Eligible now | Publish a sanitized public workspace ([guide](https://learning.postman.com/docs/postman-api-network/showcase/publish/overview)). |
| APIList | Eligible now (reviewed) | Submission form at https://apilist.fun/new. |
| RapidAPI | Possible | Paid APIs supported, but billing model must be mapped to RapidAPI plans. |
| awesome-playwright / awesome-cypress | After repo is public + a real example | Lists accept useful guides/examples. |
| awesome-testing | Possible | Tool listings accepted if relevant (CC0 contributions). |
| Playwright / Testing Library core docs | Not suitable | Unsolicited vendor additions are closed; tests must be hermetic. |
| Show HN | Conditional | Must be usable without heavy barriers; post must be written by the maker ([rules](https://news.ycombinator.com/showhn.html)). |
| Product Hunt | Eligible if usable | Personal maker account required; no vote buying. |
| DEV.to | Tutorial only | Educational article with affiliation disclosure. |
| Reddit, Indie Hackers | Hold | Live self-promotion rules could not be verified. |

## Drafts
- **Product Hunt tagline:** Temporary email inbox API for E2E and QA tests
- **Product Hunt description:** RealMailPro is a paid temporary-email API for E2E, QA and sign-up flow testing on accounts you own. Create 10-minute Gmail/Outlook alias or original inboxes, poll messages with detected OTP codes, and read full messages. $10 minimum deposit; $1 = 1,000 credits.
- **DEV.to outline:** Testing your own email-verification flow with Playwright and a temporary inbox API — disclosure → when to mock instead → sample app → server-side key → create inbox → poll with timeout → read OTP → handle expiry/costs → redact CI logs.
- **Show HN:** the maker must write it personally (HN prohibits generated posts). Key facts: what it does, paid, authorized testing only.

## Risks
Disposable-email tools are often associated with abuse. Always state: accounts you own, no spam or bypassing other services' rules, no Google/Microsoft affiliation, never publish keys, messages or OTPs.

Recommended order: make repo public (after approval) → Postman + APIList → APIs.guru → Playwright/Cypress example → curated lists → launch platforms.
