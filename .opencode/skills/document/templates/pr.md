# PR Template

Produce a title and body. Always return both as text (the skill shows them in the chat). Touch `gh` only per **GH_ACTION**: `none` → chat only; `gh pr create` → create the PR with this body; `gh pr edit` → update the existing PR's body. Never invent a different gh command.

## Title

One line, `type(scope): short description` per `docs/git-conventions.md`. Imperative mood, lowercase start, 72 chars max, no trailing period. Scopes: auth, user, vendor, product, search, order, payment, delivery, notification, review, analytics, ai, admin, api, db, infra, ci, deps, docs, config. Examples: `feat(auth): add Google OAuth login`, `fix(cart): resolve race condition on inventory lock` (note: prefer the `order` scope for cart/checkout work).

## Body structure

```markdown
## What

<1 to 3 sentences: what this PR does, in plain terms.>

## Why

<The motivation. Link the PRD story (e.g. "Implements US-031 checkout flow, FR-027 saga") and the todos IDs closed (e.g. "Closes ORDR-007, ORDR-008"). Reference the issue/ticket if known.>

## Changes

- <key change, grouped logically, not a raw commit dump>
- <key change>

## How to test / verify

- <the steps or commands a reviewer runs to confirm it works>
- <what they should observe>

## Risk & rollout

<Blast radius, migrations, feature flags, or rollback notes. Write "Low risk, no migrations, no flags." when that's true.>

## Notes for reviewers

<Anything that helps the review: a tricky decision, a deliberate tradeoff, an area wanting extra eyes. Omit if nothing.>
```

Rules:
- Group changes by intent, not by file or commit. A reviewer wants the story, not `git log`.
- Keep "What" skimmable. A busy reviewer reads it first.
- If review findings exist for this change, reference accepted residual risks under "Risk & rollout".
- Do not invent test steps. Derive them from the actual tests or the change's behaviour.
