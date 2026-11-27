# AGENTS.md

Cross-agent contract for the portfolio redesign (repo:
`yuangtong/yuangtong.github.io`, served at `yuangtong.dev`). It governs how the
two agents working on this repository divide work, escalate, run in parallel and
attribute their commits. Adapted from the FOMMO Studio website contract.

Repository conventions (design direction, changelog traceability, no-emoji rule,
branch policy) live in [`CLAUDE.md`](CLAUDE.md). Release and traceability policy
lives in [`docs/VERSIONING.md`](docs/VERSIONING.md).

## Work split

The redesign is built by two agents with separate responsibilities. They are
named by role, whichever tool runs them.

**UI agent owns the visible surface:**

- UI and UX: layout, spacing, motion, responsive behaviour, palettes.
- The cell canvas system (indexed canvas, tiles, dithering, the horse) and every
  canvas or WebGL piece.
- Sections, pages and presentational components.
- Visible copy while it is placeholder; final copy comes from the owner.
- The design token layer.

**CMS agent owns the content pipeline:**

- Sanity: project, datasets, schemas, Studio, GROQ queries, image pipeline,
  preview and visual editing.
- Data fetching, caching and revalidation.
- Environment variables and secrets for the above.

When a task straddles the line, the owner of the foundational half leads and the
other agent follows on a dependent branch.

## The content contract

The UI is built before the CMS is connected, so both agents meet at one seam:

- `src/content/types.ts` declares the shape of every content type the UI
  consumes (`Experiment`, `Note`, `LogEntry`, `StudioCase`, `Settings`).
- `src/content/fixtures/` holds local example data in exactly those shapes.
- Components receive content through props typed with those types. Components
  never import a CMS client, never write a query and never read fixtures
  directly; pages get content through the loader functions in `src/content/`.
- The CMS agent connects Sanity by re-implementing those loader functions. If
  the Sanity schema needs a different shape, the type changes first, in its own
  commit, and the UI follows.

A change to `src/content/types.ts` is foundational work: one owner per change,
merged before anything that depends on it.

## Escalate and stop

If either agent determines that the requested work belongs to the other role, or
would be done better or more safely there, it says so and stops. It does not
start the work and does not keep going out of inertia. Work resumes only after
an explicit answer from the owner.

State three things when escalating: what was requested, why the other agent is
the better fit, and what you recommend. Then wait.

## Parallel execution

Both agents may work at the same time on separate branches when the tasks are
independent.

- Foundational work has a single owner and merges first: shared configuration,
  route structure, design tokens and the content contract. The dependent branch
  rebases on the merged result and merges after.
- Never two agents editing the same working tree without committing.
- Declare the paths the other agent must not touch before starting.
- When a plan is split, present the parallel plan exactly once: the assignment
  per agent, the branch each one uses and the merge order. If it must change,
  stop and escalate.

## Agent attribution

Every commit that changes product code or product documentation carries a
trailer naming the role that authored it:

```
Agent: UI
```

or

```
Agent: CMS
```

The trailer goes in the same commit as the change, alongside the `CHANGELOG.md`
`[Unreleased]` update required by [`docs/VERSIONING.md`](docs/VERSIONING.md).

## Hygiene

- No emojis anywhere in the repository: documentation, code, logs, commit
  messages, PR titles and bodies. Use `[x]`, `[~]`, `[ ]`, `[!]` as status
  markers in docs.
- Reuse before creating. No palette values, fonts or spacing scales outside the
  token layer (see `CLAUDE.md`).
- One change per branch, opened as a PR against `main`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
