# LUMEN — Learning Ecosystem Web

The frontend of the LUMEN Learning Ecosystem — the interface students, tutors, mentors, and administrators live in.

**Status:** 🏗️ Pre-alpha — Milestone 2 of 34

## Stack

Nuxt 3 · Vue 3 · TypeScript · Vuetify + TailwindCSS · Pinia (client state) · TanStack Query (server state) · VeeValidate + Zod · Axios · Laravel Echo (WebSockets)

## Principles

- **Design system first:** deep teal `#0F766E` / sky blue `#3B82F6` / amber `#F59E0B`; Plus Jakarta Sans headings, Inter body; 12–16px radii, soft shadows, 8px grid; dark mode from day one; WCAG 2.1 AA for users aged 16–70+.
- **Server state lives in TanStack Query, never Pinia** — see [ADR-008](../lms-api/docs/01-architecture/adr/ADR-008-frontend-state.md).
- **Types are generated** from the API's OpenAPI spec — the frontend cannot drift from the backend contract.
- Every screen works before its WebSocket enhancements.

## Documentation

System docs (architecture, ADRs, API conventions) are canonical in the [`lms-api`](../lms-api) repository. Frontend-specific docs (design tokens, component guidelines) land here from Milestone 5.

## Getting started

Nuxt scaffold + design system arrive in Milestone 5 (local Docker environment in Milestone 3). Until then this repo is conventions only.

## Workflow

Same rules as the API repo: [CONTRIBUTING.md](CONTRIBUTING.md).
