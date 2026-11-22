# Versioning and traceability

This repository follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html)
and keeps a changelog in the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/)
format at [`CHANGELOG.md`](../CHANGELOG.md).

## SemVer policy

Given a version `MAJOR.MINOR.PATCH`:

- `MAJOR`: a ground-up change to the site, such as the version 2 redesign.
- `MINOR`: a new feature or shipped milestone (a new page, a new lab piece, a
  new integration), backward compatible.
- `PATCH`: bug fixes, copy tweaks, documentation, refactors and dependency
  bumps with no user-facing feature change.

The version of record lives in `package.json` and is mirrored by a git tag
`vMAJOR.MINOR.PATCH` on release.

## Mandatory traceability rule

Every commit that changes product code or product documentation MUST update
`CHANGELOG.md` under `[Unreleased]`, in the same commit, AND carry an agent
attribution trailer.

- Add entries under the appropriate group: `Added`, `Changed`, `Deprecated`,
  `Removed`, `Fixed`, `Security`.
- Write entries for a reader, not a diff: describe the observable change.
- No emojis anywhere (see [`CLAUDE.md`](../CLAUDE.md)).

### Agent attribution trailer

The same commit ends with the trailer identifying the role that authored it,
as defined in [`AGENTS.md`](../AGENTS.md):

```
Agent: UI
```

or

```
Agent: CMS
```

A commit that changes product code or product documentation without both the
changelog entry and the trailer is incomplete. Commits that touch only files
that never ship (CI config, editor settings) are exempt; when in doubt, add a
changelog line.

## Release process

1. Ensure `[Unreleased]` reflects everything since the last tag.
2. Replace the `[Unreleased]` heading with the new version and date, and open a
   fresh empty `[Unreleased]` section above it.
3. Bump `version` in `package.json` to match.
4. Update the comparison links at the bottom of `CHANGELOG.md`.
5. Commit as `release: vX.Y.Z`.
6. Tag the commit and push the tag, with the owner's confirmation.

## Baseline

`1.0.0` is the retroactive baseline: the version 1 site as it stands on `main`
at commit `db6054a`. It has no predecessor tag. The redesign ships as `2.0.0`.
