# Releasing

Releases are cut by maintainers only. **Nothing is published to npm or PyPI without explicit approval from the repository owner.**

## Versioning

- [Semantic Versioning](https://semver.org/). While the SDKs are `0.x`, minor versions may contain breaking changes; these are called out in `CHANGELOG.md`.
- The TypeScript SDK (`sdk/javascript/package.json`) and Python SDK (`sdk/python/pyproject.toml`, `__init__.py`) share one version number.
- Repository tags use `vX.Y.Z`.

## Checklist

1. All CI jobs are green on `main`.
2. API behaviour described in the release has been checked against <https://realmailpro.online/docs>; anything still unconfirmed stays marked **NEEDS VERIFICATION**.
3. Move entries from **Unreleased** to a new version heading in `CHANGELOG.md`.
4. Bump the version in both SDKs.
5. Build locally: `npm run build` (sdk/javascript) and `python -m build` (sdk/python).
6. Run a secret scan over the diff since the last tag.
7. Tag `vX.Y.Z` and create a GitHub release with the changelog section as notes.
8. Package publication (npm / PyPI) is a separate, owner-approved step. Until it happens, docs must keep saying "not on npm" / "not on PyPI".

## Protecting releases

Recommended repository settings once the repository is public:

- Branch protection on `main`: required CI checks, one approving review, no force pushes.
- Tag protection for `v*`.
- Enable secret scanning, push protection and Dependabot alerts.
- Publishing tokens (if ever approved) live only in GitHub environments with required reviewers — never in the repository.
