# AGENTS.md

## Purpose and priority

This file contains mandatory instructions for AI coding agents working in this repository.

- Follow the user's current request first.
- Then follow this file, `README.md`, and nearby implementation patterns.
- When this file conflicts with older documentation, this file is the newer repository rule.
- Make only the requested change and preserve existing behavior unless the task changes it.
- Keep diffs focused and reviewable.
- Never hide a problem with ignore comments, disabled rules, unsafe casts, placeholder implementations, or silent fallbacks.
- Report unresolved assumptions instead of silently inventing requirements.

## Product context

This project is a professional bilingual (Persian/English) RTL/LTR front-end web application. It is a front-end-only project.

For UI/UX direction, use the legacy project below as a visual and UX reference only:

- Address: `<LEGACY_PROJECT_URL>`
- Name: `<LEGACY_PROJECT_NAME>`

The legacy project's styling is not considered correct or final. Use it only to understand the shape, flow, and UX intent. Colors, sizes, borders, radii, spacing, and similar visual decisions should be derived from that legacy project's look and feel, then reimplemented cleanly using `shadcn/ui` components and the `shadcn` theme structure.

Whenever possible, use existing `shadcn/ui` components. Do not alter the base structure of `shadcn` components unless it is genuinely necessary.

## Read before changing code

Before making a meaningful change, read and inspect:

1. `AGENTS.md`
2. `README.md`
3. the relevant route and nearby implementation patterns
4. `src/styles/theme.css` (or the equivalent `shadcn` theme file) and the existing `shadcn/ui` components for UI work

Do not replace documented project decisions with generic best practices.

## Current stack

- Next.js 16 with App Router
- React 19 and strict TypeScript
- Bun for scripts and package management
- Tailwind CSS v4 with CSS-first configuration
- `shadcn/ui` components vendored under `src/components/ui/`
- Radix primitives (and/or React Aria where used by the installed `shadcn` components)
- `lucide-react` for icons (`shadcn` default)
- `next-themes` for theme switching (light / dark), using the `shadcn` theme structure
- Biome for formatting, linting, and import organization
- `@/*` path alias mapped to `src/*`

Before adding a package, verify that the repository does not already provide the required capability. Do not add overlapping UI, styling, form, state, formatting, or icon libraries.

## Internationalization (i18n) and direction

- The project must support two languages: Persian (`fa`) and English (`en`).
- The project must support both `RTL` (right-to-left) and `LTR` (left-to-right) layouts.
- Direction must be driven by the active locale, not hardcoded per component.
- Use logical CSS properties (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`, `text-end`) instead of physical ones (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`) wherever possible.
- Do not assume English string length or LTR icon placement. Test long Persian labels, number combinations, truncation, and wrapping where relevant.
- Use shared formatters for currency, dates, numbers, and locale-sensitive values when those utilities exist. Do not duplicate formatting logic inside page components.
- All user-visible text must be localized for the active locale unless explicitly marked developer-only.

## Repository boundaries

```text
src/app/                    App Router routes, layouts, and route-local UI
src/components/ui/          shadcn/ui primitives (do not restructure)
src/components/             Shared project components (only when truly reused)
src/features/               Shared code belonging to one product domain, when introduced
src/hooks/                  Truly reusable React hooks
src/providers/              Application providers
src/styles/                 Global styles, theme tokens, and typography
src/utils/                  Reusable utilities
src/api/                    Browser HTTP clients for external or public APIs consumed by the front end
```

Do not move code into a shared directory merely because a component is visually large.

## Mandatory route-local component rule

Any component used by only one page or route must live beside that route in a directory named exactly `_components/`.

```text
src/app/<route>/
|-- page.tsx
|-- _components/
|   |-- some-card.tsx
|   `-- some-toolbar.tsx
```

- Use the singular name `_components/` exactly.
- This especially applies to small future components that are not part of `shadcn/ui` and only support one page.
- Keep one-off sections, cards, toolbars, dialogs, and page-specific helpers in the route's `_components/` directory.
- Do not place page-specific components in `src/components/`.
- If a component becomes shared within one product domain, place it in `src/features/<feature>/`.
- Only components reused by unrelated routes or domains belong in a shared component directory.
- `shadcn/ui` primitives remain in `src/components/ui/` and must not be copied into `_components/`.

## Next.js and React

- Use the App Router.
- Server Components are the default.
- Add `"use client"` only when browser APIs, state, effects, context, or event handlers require it.
- Keep client boundaries as small as possible; do not make a full page a Client Component for one interactive child.
- Add route-level `loading.tsx`, `error.tsx`, and `not-found.tsx` when the route experience requires them.
- Use `next/image` for application images and configure remote sources narrowly.
- Preserve strict typing. Do not use `any`, `@ts-ignore`, or broad assertions to bypass errors.
- Keep effects and hook dependency arrays correct; do not suppress dependency diagnostics.
- Prefer the `@/*` alias for imports across top-level `src` directories and relative imports for closely related local files.

## Conditional logic

- Never use nested ternary expressions under any circumstances.
- Replace multi-branch conditional expressions with clearly named helpers, early returns, or `if`/`else` statements.
- A ternary expression must not contain another ternary expression in its condition, consequent, or alternate branch.

## Front-end data and API usage

Any data comes from external or public HTTP APIs.

1. Put browser fetch functions in `src/api/`.
2. Put data-fetching hooks (for example React Query hooks) in `src/hooks/queries/`.
3. Validate untrusted route parameters and query strings before using them in requests.
4. Apply search and filters via the API query parameters, not by filtering fetched result arrays in Client Components.
5. Paginate collection requests with a bounded page size and deterministic ordering. Never fetch a full list and slice it client-side.
6. Use a Client Component request only when browser interaction, polling, refetching, optimistic updates, or browser-only state requires it.
7. Do not add a global state library without a concrete cross-tree persistence requirement and explicit approval.

## shadcn/ui component workflow

Before creating any UI primitive:

1. Search the project for an existing component.
2. Reuse or compose the existing component when appropriate.
3. If the component is not present, check whether `shadcn/ui` provides it.
4. Use the `shadcn` CLI when adding an available primitive is appropriate.

Example:

```bash
bunx shadcn@latest add input
```

- Import `shadcn/ui` components from their project paths under `src/components/ui/`.
- Do not recreate Button, Input, Select, Badge, Tabs, Dialog, Tooltip, DropdownMenu, Table, Pagination, Form, or similar primitives.
- Preserve existing `shadcn/ui` APIs, interaction behavior, and accessibility.
- Prefer composition over adding one-off variants to shared primitives.
- Do not modify a shared `shadcn` primitive solely to make one page easier unless the requirement genuinely applies to every consumer.
- Use `lucide-react`; do not add another icon library or draw replacement icons manually.
- Use the existing `cn` utility (from `src/lib/utils`) for class composition. Do not add `clsx`, `tailwind-merge`, or another class-composition convention outside of it.

## Styles and design tokens

- Use Tailwind CSS v4 utilities and the CSS-first theme in `src/styles/theme.css`.
- The theme structure must follow the `shadcn` theme structure: CSS variables defined in `:root` and `.dark`, mapped to Tailwind via `@theme inline` or the equivalent `shadcn` setup.
- Never hardcode color values in components. Every color must resolve through an existing semantic theme token (for example `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, plus `chart` and `sidebar` tokens).
- Search the theme before adding a token.
- If the UI requires a color that does not exist, add the smallest necessary token to `theme.css` following `shadcn`'s existing semantic naming structure.
- Do not invent arbitrary color names such as a page name plus a shade.
- Brand colors must replace or extend the appropriate existing brand tokens while preserving `shadcn` naming.
- Reuse the existing spacing, sizing, typography, radius, breakpoint, and shadow scales whenever possible.
- If a repeated design value is absent, extend the relevant theme scale with the existing naming convention instead of scattering arbitrary values across components.
- A truly one-off structural measurement may use Tailwind's arbitrary-value syntax only when no meaningful reusable token exists.
- Do not add CSS Modules, CSS-in-JS, inline `<style>` blocks, or another styling system.
- Do not introduce a new brand palette inside a component.
- Keep global CSS limited to tokens, base behavior, shared utilities, and carefully scoped third-party requirements.
- Treat decorative SVGs as decorative with correct accessibility attributes; give meaningful graphics an accessible localized label or title.

## Light and dark theme compatibility

- Follow the existing `shadcn` theme architecture with `next-themes`.
- The current provider maps themes to light and dark; do not create a second theming mechanism.
- Prefer semantic tokens such as `background`, `foreground`, `card`, `border`, `muted`, and `primary` over raw palette utilities.
- Define both light and dark token values when extending semantic colors.
- Components must gain future theme switching through token changes, without component-level color rewrites.
- Check contrast and interaction states in both themes when a task affects colors.

## Persian and RTL

- All user-visible product text must be localized for the active locale unless explicitly marked developer-only.
- Preserve RTL layout and use logical alignment/spacing behavior where possible.
- Do not assume English string length or left-to-right icon placement.
- Test long Persian labels, number combinations, truncation, and wrapping where relevant.
- Use shared formatters for currency, dates, numbers, and locale-sensitive values when those utilities exist.
- Do not duplicate formatting logic inside page components.

## Forms and local state

- Reuse the existing `shadcn` form and field primitives (built on React Hook Form and Zod where applicable).
- Do not hand-roll repetitive field state, labels, hints, and error wiring.
- Search filters remain URL state even when a form-like interface edits them.
- Use local component state for temporary UI behavior.
- Do not add a global state library without a concrete cross-tree persistence requirement and explicit approval.

## Accessibility and interaction

- Preserve `shadcn`/Radix keyboard behavior.
- Use semantic elements before adding roles.
- Every button must have the correct explicit type when applicable.
- Interactive elements must have visible focus states and usable accessible names.
- Decorative media must be hidden from assistive technology; meaningful media needs localized alternative text.
- Do not remove focus outlines without an equivalent token-based focus-visible treatment.
- Ensure target sizes and disabled/loading behavior remain usable on touch and keyboard interfaces.

## Quality and scope

- Inspect `git status` before and after changes.
- Existing modifications belong to the user; do not overwrite or revert them.
- Do not perform unrelated refactors, renames, formatting sweeps, or dependency upgrades.
- Do not rename routes, files, components, or public component props without a clear requirement.
- Do not add barrel files that blur Server/Client boundaries.
- Fix the cause of diagnostics. Do not add Biome ignore comments or disable rules to obtain a clean check.

## Required verification

Use Bun commands from the repository root:

```bash
bun run check
bunx tsc --noEmit
bun run build
```

- Run `bun run check` after every code change and resolve every diagnostic without ignores. This includes Biome formatting and lint checks.
- Run `bunx tsc --noEmit` for TypeScript changes.
- Run `bun run build` when changing routes, rendering, images, configuration, or dependencies.
- Never claim a command or visual check passed unless it was actually performed successfully.

## Completion report

Every completion message should briefly state:

- what changed and why;
- checks and Biome lint/format commands actually run;
- Persian/English, RTL/LTR, and light/dark verification when relevant;
- unresolved assumptions;
- whether unrelated files were left untouched.