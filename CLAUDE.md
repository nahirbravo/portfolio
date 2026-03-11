# Portfolio Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-11

## Active Technologies

- TypeScript 5.x strict (`any` prohibido, `noImplicitAny: true`) — 001-portfolio-personal
- React 18 + Vite 5 — SPA pura, sin SSR
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, sin `tailwind.config.ts`)
- Framer Motion v11 — único motor de animaciones permitido
- Zustand v5 — estado global (usar `useShallow` para selectores multi-campo)
- Supabase v2 — Auth + PostgreSQL + Storage

## Project Structure

```text
src/
├── components/admin/    # AdminLayout, forms, panels
├── components/public/   # HeroSection, ProjectsSection, etc.
├── components/shared/   # ProtectedRoute, LoadingSkeleton
├── hooks/
├── lib/supabase.ts
├── pages/admin/
├── pages/public/
├── stores/              # useAuthStore, usePortfolioStore, useAdminStore
├── types/index.ts
└── utils/

specs/001-portfolio-personal/   # Todos los artefactos de diseño
```

## Commands

pnpm dev          # Servidor de desarrollo
pnpm build        # Build de producción
pnpm typecheck    # TypeScript check
pnpm lint         # ESLint

## Code Style

- TypeScript strict: `any` prohibido, imports absolutos `@/...`
- Archivos: kebab-case.tsx | Componentes: PascalCase | Hooks: useCamelCase
- Async: async/await siempre, try/catch explícito en toda operación async
- Package manager: pnpm — nunca npm ni yarn

## Recent Changes

- 001-portfolio-personal: Stack completo definido — React 18 + Vite + TS + Tailwind v4 + Supabase + Framer Motion

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
