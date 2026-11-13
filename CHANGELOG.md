# Changelog

All notable changes to the yuangtong.dev portfolio are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Traceability rule: every commit that changes product code or documentation must
update this file under `[Unreleased]` in the same commit. See
[docs/VERSIONING.md](docs/VERSIONING.md).

## [Unreleased]

### Pending

Owner decisions and housekeeping, to pick up later:

- [ ] Archive version 1: tag `v1.0.0` and an archive branch on commit `db6054a`.
- [ ] Framework for version 2 (Next.js or keep Vite).
- [ ] The narrative the horse carries through the site.
- [ ] Which current projects stay here and which move to the studio's site.
- [ ] Site languages and which one is the source.
- [ ] Remove tracked leftovers: `node_modules 2/`, `package-lock 2.json`,
      `nohup.out` and three `vite.config.ts.timestamp-*.mjs` files.

### Added

- Cross-agent contract (`AGENTS.md`), repository rules (`CLAUDE.md`), this
  changelog and the versioning policy (`docs/VERSIONING.md`), adapted from the
  FOMMO Studio website. They define the UI agent and CMS agent roles, the
  content contract between them, the agent trailer and the design direction
  agreed for version 2.

## [1.0.0]

Retroactive baseline: the version 1 site (React, Vite, Tailwind, Framer Motion,
Netlify) as it stands on `main` at commit `db6054a`. Not tagged yet.
