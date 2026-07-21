<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project

Business website for Jonathan Freire, freelance Digital Product Architect (sole trader, Berlin).

## Brand context

The brand system is the source of truth. Load these files before working on any task that touches the surface, copy or structure of the site.

- `../brand/DESIGN.md` — visual system: colour, typography, spacing, grid, components, page sections. **Mandatory context for every task in this folder.**
- `../brand/strategy.md` — voice, messaging, services, positioning, vocabulary rules. **Load only if the task requires brand voice, copy or positioning decisions.**

**Direction of change.** When the brand docs and the implementation diverge, the docs win. Update the implementation to match. The brand files live in `../brand/` and are edited there, not from this project.

Do not introduce new colours, type styles, spacing values, components or vocabulary. If the design needs something not in the system, the design is wrong — revisit the brief, not the system. The full vocabulary ban, spacing scale, component list and section list all live in the brand files.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind 4 · Sanity CMS · shadcn/ui · Radix · motion · next-themes. Font is **Inter** (per `../brand/DESIGN.md` §3), not the Geist default from `create-next-app`. Dark mode follows the system.

## Copy and voice

Public-facing copy is English. Legal and admin is German. Spanish only when the context requires it, never mixed with English in the same piece. First-person singular only — no team language, no studio, no agency. Banned vocabulary (end-to-end solution, synergy, disruptive, ecosystem unless literal, "expert in", "passionate about") is enforced via `../brand/strategy.md` §8.

## Verification

- `pnpm lint` — ESLint.
- `pnpm build` — typecheck and production build.
