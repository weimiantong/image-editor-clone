# Repository Guidelines

## Project Structure & Module Organization
- `app/` Next.js App Router routes, layouts, and server actions; colocate route components under folders (e.g., `app/editor/page.tsx`).
- `components/` Reusable UI (PascalCase files, e.g., `components/Toolbar.tsx`).
- `hooks/` Custom React hooks (`hooks/use-zoom.ts`).
- `lib/` Utilities and shared logic (`lib/canvas.ts`).
- `public/` Static assets served from root (`/public/icons/...`).
- `styles/` Global and layer styles (Tailwind/PostCSS).
- Root config: `next.config.mjs`, `tsconfig.json`, `postcss.config.mjs`, `components.json` (shadcn/ui registry).

## Build, Test, and Development Commands
- `pnpm install` Install dependencies (repo uses pnpm; lockfile is `pnpm-lock.yaml`).
- `pnpm dev` Start local dev server with HMR at http://localhost:3000.
- `pnpm build` Production build via `next build`.
- `pnpm start` Run the production server (after build).
- `pnpm lint` Run ESLint across the project.

## Coding Style & Naming Conventions
- Language: TypeScript + React 19, Next.js App Router, Tailwind CSS v4.
- Indentation 2 spaces; prefer named exports; keep components pure and small.
- Files: Components PascalCase (`components/ToolButton.tsx`); hooks `use-*.ts`; utils lowercase kebab-case (`lib/color-utils.ts`).
- Styling: Prefer Tailwind utility classes; extract to components when class lists grow.
- Linting: Use `pnpm lint` and fix warnings before committing.

## Testing Guidelines
- No test runner is configured yet. When adding one, prefer Vitest + React Testing Library for units and Playwright for e2e.
- Naming: `*.test.ts` or `*.test.tsx`, colocated with source or under `tests/`.
- Aim for coverage on critical image-editing logic in `lib/` and interactive components in `components/`.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat: add crop tool`, `fix: correct canvas scale on zoom`).
- PRs: Include a clear description, linked issues, and screenshots/GIFs for UI changes.
- Checks: Ensure `pnpm build` and `pnpm lint` pass; note any migrations or env changes in the PR.

## Security & Configuration Tips
- Do not commit secrets; put runtime config in `.env.local` and document required vars in the PR.
- Place user-visible assets under `public/`; avoid bundling large binaries in the repo.
