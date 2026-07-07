# Contributing & Git Workflow

The canonical workflow rules live in [`lms-api/CONTRIBUTING.md`](../lms-api/CONTRIBUTING.md) — branching, Conventional Commits, squash-merge PRs, and release tagging apply here identically.

## Frontend-specific additions

- **Scopes** in commits are UI domains or areas: `feat(player): …`, `fix(checkout): …`, `feat(ui): …` (design-system primitives), `chore(types): …` (generated API types).
- Regenerated API types (`types/api/`) are committed in their own `chore(types)` commit — never mixed into feature diffs.
- Every PR touching UI includes screenshots (light **and** dark mode) in the PR description.
- Accessibility is review-blocking: keyboard path, focus states, and contrast checked before merge (WCAG 2.1 AA).
- Server state in Pinia is a review reject — see [ADR-008](../lms-api/docs/01-architecture/adr/ADR-008-frontend-state.md).
