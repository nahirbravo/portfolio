# Implementation Plan: Portfolio Personal

**Branch**: `001-portfolio-personal` | **Date**: 2026-03-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from [`spec.md`](./spec.md) (FR-001–FR-026, SC-001–SC-008)

**Note**: Este plan fue generado por el comando `/speckit.plan`. La spec formal fue ratificada en una segunda pasada de `/speckit.specify`. Ambos artefactos están sincronizados.

---

## Summary

Portfolio personal de desarrollador full-stack: SPA construida en React 18 + Vite + TypeScript
con diseño oscuro, animaciones Framer Motion y panel admin protegido. El contenido (proyectos,
certificaciones, skills, perfil) se gestiona 100% desde el panel admin via Supabase PostgreSQL
con RLS (lectura pública / escritura solo admin autenticado). Imágenes en Supabase Storage.
Deploy en Netlify o Vercel (pendiente decisión final).

---

## Technical Context

**Language/Version**: TypeScript 5.x (strict — `any` prohibido, `noImplicitAny: true`)
**Primary Dependencies**:
- React 18 + Vite 5 (frontend + build)
- Tailwind CSS v4 + `@tailwindcss/vite` (estilos)
- Framer Motion v11 (animaciones — único motor permitido)
- Zustand v5 (estado global)
- React Router DOM v7 (routing)
- React Hook Form v7 + Zod v3 (formularios + validación)
- @supabase/supabase-js v2 (Auth + DB + Storage)
- @emailjs/browser v4 (formulario de contacto)

**Storage**: Supabase PostgreSQL (tablas: `profile`, `projects`, `certifications`, `skills`) + Supabase Storage (bucket: `portfolio-images`, público)
**Testing**: N/A — MVP sin cobertura de tests en este plan
**Target Platform**: Web SPA — browsers modernos (Chrome 90+, Firefox 90+, Safari 14+)
**Project Type**: Web application — SPA con sección pública y panel admin protegido
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals verde). Carga total < 3s en 4G estándar.
**Constraints**: Sin SSR/SSG — Vite SPA puro. Sin offline. Mobile-first (375px+). Sin multi-usuario.
**Scale/Scope**: 1 admin, N visitantes. ~4 entidades. ~10 secciones/rutas.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Requerimiento | Estado | Evidencia en el plan |
|-----------|--------------|--------|----------------------|
| I. Performance | <3s 4G, Core Web Vitals verde, lazy loading + Suspense | ✅ PASS | Fase 5: loading skeletons, lazy sections, optimización de assets |
| II. Diseño Oscuro | Fondo #0A0A0F+, acentos vividos, Framer Motion exclusivo, no kits genéricos | ✅ PASS | Fase 1: Tailwind dark (slate-900/800 + violet/cyan). Fase 4: Framer Motion en todas las animaciones |
| III. Contenido Editable | CRUD completo desde admin para todas las entidades | ✅ PASS | Fase 3: AdminProfile, AdminProjects, AdminCertifications, AdminSkills con create/edit/delete |
| IV. Auth Admin | /admin protegido, sin registro público, sesión expira | ✅ PASS | Fase 1: ProtectedRoute + Supabase Auth. Sin endpoint de registro. |
| V. Responsive | 375px+, 768px+, 1280px+ sin roturas | ✅ PASS | Fase 4: mobile-first responsive en todas las secciones |
| Stack fijo | React 18 + TS + Vite + Tailwind + Supabase + pnpm | ✅ PASS | Stack coincide exactamente con la constitución |
| Deploy | Netlify o Vercel | ⚠️ PENDIENTE | TODO(DEPLOY) registrado en constitución — decisión en Fase 6 |

**Veredicto post-Phase-0**: ✅ GATE PASSED — Sin violaciones. TODO(DEPLOY) es un diferimiento conocido, no una violación de principios.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-personal/
├── plan.md              # Este archivo (/speckit.plan)
├── research.md          # Phase 0 output (/speckit.plan)
├── data-model.md        # Phase 1 output (/speckit.plan)
├── quickstart.md        # Phase 1 output (/speckit.plan)
├── contracts/           # Phase 1 output (/speckit.plan)
│   ├── supabase-schema.sql   # DDL completo
│   ├── rls-policies.sql      # RLS policies
│   ├── storage-policy.sql    # Storage bucket policies
│   └── typescript-types.ts   # Tipos TypeScript derivados del schema
└── tasks.md             # Phase 2 output (/speckit.tasks — NO creado aquí)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx        # Sidebar + Outlet
│   │   ├── AdminSidebar.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── CertificationForm.tsx
│   │   ├── SkillForm.tsx
│   │   └── ImageUpload.tsx        # Reutilizable
│   ├── public/
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── CertificationsSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Navbar.tsx
│   └── shared/
│       ├── ProtectedRoute.tsx
│       ├── LoadingSkeleton.tsx
│       └── ConfirmDialog.tsx
├── hooks/
│   ├── useImageUpload.ts
│   └── useScrollTo.ts
├── lib/
│   └── supabase.ts               # Cliente Supabase singleton
├── pages/
│   ├── admin/
│   │   ├── AdminLogin.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProfilePage.tsx
│   │   ├── AdminProjectsPage.tsx
│   │   ├── AdminCertificationsPage.tsx
│   │   └── AdminSkillsPage.tsx
│   └── public/
│       └── PublicPortfolio.tsx    # Single-page scroll
├── stores/
│   ├── useAuthStore.ts
│   ├── usePortfolioStore.ts
│   └── useAdminStore.ts
├── types/
│   └── index.ts                  # Profile, Project, Certification, Skill
└── utils/
    ├── imageUpload.ts
    └── formatDate.ts

public/
└── favicon.ico

.env.example
index.html
vite.config.ts
tsconfig.json
tsconfig.app.json
```

**Structure Decision**: SPA pura con un solo proyecto React. No hay backend separado — Supabase gestiona DB, Auth y Storage. El panel admin vive dentro de la misma app, protegido por `ProtectedRoute`.

---

## Phases

### Fase 1 — Setup y Auth Admin
**Objetivo**: Proyecto corriendo con login de admin funcional.

- [ ] Crear proyecto: `pnpm create vite@latest portfolio -- --template react-ts`
- [ ] Instalar deps: `pnpm add @supabase/supabase-js zustand react-router-dom react-hook-form @hookform/resolvers zod framer-motion @emailjs/browser`
- [ ] Instalar deps dev: `pnpm add -D tailwindcss @tailwindcss/vite`
- [ ] Configurar Tailwind v4 + Vite (`vite.config.ts` + CSS `@import "tailwindcss"`)
- [ ] Definir design tokens en CSS (`--color-bg`, `--color-accent-cyan`, `--color-accent-violet`)
- [ ] Crear proyecto en Supabase
- [ ] Configurar `.env` + `.env.example`
- [ ] Crear `src/lib/supabase.ts`
- [ ] Crear `useAuthStore` (signIn, signOut, initialize, session)
- [ ] Crear `AdminLogin` page con formulario email+password (RHF + Zod)
- [ ] Crear `AdminLayout` (sidebar + `<Outlet />`)
- [ ] Crear `ProtectedRoute`
- [ ] Configurar rutas en `App.tsx`

**✅ Checkpoint**: Login funciona, layout admin visible, logout limpia la sesión.

### Fase 2 — Base de Datos
**Objetivo**: Schema completo en Supabase con RLS.

- [ ] Ejecutar DDL: tablas `profile`, `projects`, `certifications`, `skills`
- [ ] Configurar RLS policies (ver `contracts/rls-policies.sql`)
- [ ] Crear bucket `portfolio-images` (público)
- [ ] Configurar storage policies
- [ ] Insertar seed data de prueba

**✅ Checkpoint**: Datos visibles en SQL Editor. RLS permite lectura anon y escritura auth.

### Fase 3 — Panel Admin (CRUD)
**Objetivo**: Gestión completa de contenido sin tocar código.

- [ ] Crear `usePortfolioStore` + `useAdminStore`
- [ ] `AdminProfilePage` — formulario de perfil + upload avatar
- [ ] `AdminProjectsPage` — lista + toggle published + `ProjectForm` + delete
- [ ] `AdminCertificationsPage` — lista + `CertificationForm` + delete
- [ ] `AdminSkillsPage` — lista por categoría + `SkillForm` + delete
- [ ] Hook `useImageUpload` (Supabase Storage, reutilizable)

**✅ Checkpoint**: Crear proyecto con imagen, verlo en lista, eliminarlo — todo desde admin.

### Fase 4 — Portfolio Público
**Objetivo**: Página pública con diseño oscuro y animaciones.

- [ ] `PublicPortfolio` (single-page scroll)
- [ ] `HeroSection` (nombre, bio, avatar, links sociales + fade-in/slide-up)
- [ ] `ProjectsSection` (grid, cards, featured más grandes, hover scale + stagger scroll)
- [ ] `CertificationsSection` (cards por categoría + link certificado)
- [ ] `SkillsSection` (por categoría, animación cascada)
- [ ] `ContactSection` (email copy + sociales)
- [ ] `Navbar` fija + scroll suave
- [ ] Responsive mobile-first en todas las secciones

**✅ Checkpoint**: Portfolio visible en mobile y desktop, animaciones funcionan, contenido desde Supabase.

### Fase 5 — Contacto y Polish
**Objetivo**: Formulario de contacto + estados edge case + SEO básico.

- [ ] Integrar EmailJS en `ContactSection`
- [ ] Loading skeletons mientras carga contenido
- [ ] Empty states (sección vacía si no hay proyectos publicados)
- [ ] Error states si falla Supabase
- [ ] Meta tags SEO (`<title>`, description, og:image)
- [ ] Favicon personalizado
- [ ] Lazy loading de secciones con Suspense
- [ ] `CLAUDE.md` con convenciones del proyecto
- [ ] `.env.example` completo

**✅ Checkpoint**: Emails enviados, skeleton visible en carga, SEO tags presentes.

### Fase 6 — Deploy
**Objetivo**: Portfolio online con URL compartible.

- [ ] TODO(DEPLOY): Elegir Netlify o Vercel
- [ ] Conectar repo GitHub
- [ ] Variables de entorno en plataforma
- [ ] Configuración SPA routing (`_redirects` o `vercel.json`)
- [ ] Deploy + verificar producción
- [ ] (Opcional) Dominio personalizado

**✅ Checkpoint**: URL pública funcionando con dominio o subdominio.

---

## Complexity Tracking

> Sin violaciones a justificar — todos los principios de la constitución se cumplen directamente con el plan propuesto.
