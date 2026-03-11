# Tasks: Portfolio Personal

**Input**: Design documents from `specs/001-portfolio-personal/`
**Prerequisites**: plan.md ✅ | spec.md ✅ | data-model.md ✅ | contracts/ ✅ | research.md ✅
**Tests**: N/A — MVP sin cobertura de tests (definido en plan.md)
**Organization**: Tasks agrupados por User Story para implementación y prueba independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Puede correr en paralelo (archivos distintos, sin dependencias entre sí)
- **[Story]**: A qué user story pertenece la tarea (US1–US7)
- Paths exactos incluidos en cada descripción

---

## Phase 1: Setup (Infraestructura del proyecto)

**Purpose**: Crear el proyecto y configurar el entorno base antes de cualquier código de feature.

- [x] T001 Inicializar proyecto con `pnpm create vite@latest portfolio -- --template react-ts` en el directorio raíz del repo
- [x] T002 Instalar dependencias de producción: `pnpm add @supabase/supabase-js zustand react-router-dom react-hook-form @hookform/resolvers zod framer-motion @emailjs/browser`
- [x] T003 [P] Instalar dependencias de desarrollo: `pnpm add -D tailwindcss @tailwindcss/vite @types/node`
- [x] T004 Configurar `vite.config.ts`: agregar plugin `tailwindcss()` de `@tailwindcss/vite` + alias `@` → `src/`
- [x] T005 Configurar TypeScript strict en `tsconfig.app.json`: `"strict": true`, `"noImplicitAny": true`
- [x] T006 Configurar Tailwind v4 en `src/index.css`: `@import "tailwindcss"` + bloque `@theme` con tokens `--color-bg-base: #0A0A0F`, `--color-bg-surface: #12121A`, `--color-accent-cyan`, `--color-accent-violet`, `--font-sans`
- [x] T007 Crear estructura de directorios `src/`: `components/admin/`, `components/public/`, `components/shared/`, `hooks/`, `lib/`, `pages/admin/`, `pages/public/`, `stores/`, `types/`, `utils/`
- [x] T008 [P] Crear `.env.example` con placeholders: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`

**Checkpoint**: `pnpm dev` corre sin errores, Tailwind aplica clases básicas.

---

## Phase 2: Foundational (Prerequisitos bloqueantes)

**Purpose**: Infraestructura core que DEBE estar completa antes de implementar cualquier user story.

**⚠️ CRÍTICO**: Ninguna user story puede comenzar hasta que esta fase esté completa.

- [ ] T009 Ejecutar `specs/001-portfolio-personal/contracts/supabase-schema.sql` en Supabase SQL Editor (crea tablas `profile`, `projects`, `certifications`, `skills` + trigger `handle_updated_at` + seed data)
- [ ] T010 [P] Ejecutar `specs/001-portfolio-personal/contracts/rls-policies.sql` en Supabase SQL Editor (RLS: lectura pública, escritura solo authenticated)
- [ ] T011 [P] Ejecutar `specs/001-portfolio-personal/contracts/storage-policy.sql` en Supabase SQL Editor (crea bucket `portfolio-images` público + storage policies)
- [x] T012 Copiar `specs/001-portfolio-personal/contracts/typescript-types.ts` → `src/types/index.ts` (tipos: `Profile`, `Project`, `Certification`, `Skill`, `Database`, form types, `AsyncState<T>`)
- [x] T013 [P] Crear `src/lib/supabase.ts`: `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)` con validación de env vars + export `supabase`
- [x] T014 [P] Crear `src/utils/formatDate.ts`: función `formatDate(dateStr: string): string` que formatea fechas ISO a formato legible (ej: "Jun 2025")
- [x] T015 Crear `src/stores/usePortfolioStore.ts`: Zustand v5 store con `profile`, `projects`, `certifications`, `skills`, `loading`, `error` + actions `fetchProfile()`, `fetchProjects()`, `fetchCertifications()`, `fetchSkills()`, `fetchAll()` usando patrón async con `set({ loading: true, error: null })` + `useShallow` en selectores
- [x] T016 [P] Crear `src/components/shared/LoadingSkeleton.tsx`: componente genérico con prop `className?: string` que renderiza un div animado `animate-pulse bg-bg-elevated rounded`
- [x] T017 [P] Crear `src/components/shared/ConfirmDialog.tsx`: modal de confirmación con props `open: boolean`, `onConfirm: () => void`, `onCancel: () => void`, `message: string`
- [x] T018 Crear `src/App.tsx`: React Router DOM v6 con `<BrowserRouter>` + rutas: `/` → `PublicPortfolio` (lazy), `/admin/login` → `AdminLogin` (lazy), `/admin/*` → `ProtectedRoute` wrapping `AdminLayout` con rutas anidadas (dashboard, profile, projects, certifications, skills)
- [x] T019 [P] Crear `src/utils/imageUpload.ts`: función `uploadImage(folder, file): Promise<string>` que valida tipo (jpg/png/webp) y tamaño + sube a Supabase Storage + retorna URL pública via `getPublicUrl()`

**Checkpoint**: Seed data visible en Supabase Table Editor. `pnpm typecheck` sin errores.

---

## Phase 3: User Story 1 — Visitante recorre el portfolio (Priority: P1) 🎯 MVP

**Goal**: La página pública es funcional, muestra contenido del seed data y tiene animaciones Framer Motion.

**Independent Test**: Acceder a `http://localhost:5173/` y verificar: perfil visible en Hero, proyectos en grid, certificaciones por categoría, skills por categoría, sección de contacto. Todo visible en 375px.

### Implementation

- [x] T020 [US1] Crear `src/pages/public/PublicPortfolio.tsx`: contenedor con `usePortfolioStore` + `fetchAll()` en `useEffect`, renders condicionales loading/error, y secciones con IDs `#hero`, `#projects`, `#certifications`, `#skills`, `#contact`
- [x] T021 [P] [US1] Crear `src/hooks/useScrollTo.ts`: hook `useScrollTo()` que retorna función `scrollTo(id: string)` usando `document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })`
- [x] T022 [P] [US1] Crear `src/components/public/Navbar.tsx`: barra fija `position: fixed` con links de navegación (Inicio, Proyectos, Certificaciones, Skills, Contacto) que usan `useScrollTo`, responsive con hamburger en mobile, fondo glassmorphism `backdrop-blur-sm bg-bg-base/80`
- [x] T023 [US1] Crear `src/components/public/HeroSection.tsx`: muestra `profile.name`, `profile.title`, `profile.bio`, `<img>` avatar, links a LinkedIn/GitHub/email; animación Framer Motion `variants` `hidden → visible` con `fadeInUp` (opacity 0→1, y 24→0, duration 0.5) + `staggerChildren: 0.1` en contenedor
- [x] T024 [P] [US1] Crear `src/components/public/ProjectCard.tsx`: card con `thumbnail_url` (img con fallback placeholder), `title`, `description` (truncado a 3 líneas), `tags` (chips), links preview/repo; `motion.div` con `whileHover={{ scale: 1.02 }}` + `boxShadow` transition
- [x] T025 [US1] Crear `src/components/public/ProjectsSection.tsx`: filtra `projects.filter(p => p.published)`, proyectos con `featured: true` se renderizan en col-span-2 (grid-cols-1 md:grid-cols-2 lg:grid-cols-3); `motion.div` container con `whileInView="visible"` + `viewport={{ once: true, amount: 0.1 }}` + `staggerChildren: 0.08`; empty state si no hay proyectos publicados
- [x] T026 [P] [US1] Crear `src/components/public/CertificationsSection.tsx`: agrupa `certifications` por `category` usando `reduce`, renderiza una sección por categoría con título; cada card muestra `title`, `institution`, `issued_at` (via `formatDate`), link a `credential_url`; `motion` stagger en scroll con `viewport={{ once: true }}`
- [x] T027 [P] [US1] Crear `src/components/public/SkillsSection.tsx`: agrupa `skills` por `category`, renderiza grid por categoría; cada skill muestra `icon` (emoji o texto) + `name` + badge de `level`; `motion` cascada en scroll con `staggerChildren: 0.05` + `viewport={{ once: true }}`
- [x] T028 [P] [US1] Crear `src/components/public/ContactSection.tsx`: muestra `profile.email` con botón copiar (`navigator.clipboard.writeText` + estado `copied: boolean` para feedback visual); links a `linkedin_url` y `github_url`; EmailJS placeholder en ContactForm
- [x] T029 [US1] Actualizar `src/pages/public/PublicPortfolio.tsx`: renders condicionales loading/error; secciones con lazy loading; responsive en 375px, 768px, 1280px

**Checkpoint**: `http://localhost:5173/` muestra perfil, proyectos (seed), certificaciones (seed) y skills (seed). Animaciones visibles al hacer scroll. Mobile-first responsive OK.

---

## Phase 4: User Story 2 — Admin accede al panel de gestión (Priority: P2)

**Goal**: Login funciona con Supabase Auth, el panel admin es accesible solo con credenciales válidas, visitantes no pueden entrar.

**Independent Test**: (1) Acceder a `/admin/login` sin auth → ver formulario. (2) Login con credenciales correctas → redirect a `/admin`. (3) Logout → redirect a `/admin/login`. (4) Acceder a `/admin/projects` sin auth → redirect a `/admin/login`.

### Implementation

- [x] T030 [US2] Crear `src/stores/useAuthStore.ts`: Zustand v5 con `session: Session | null`, `user: User | null`, `loading: boolean`, `initialized: boolean`; `initialize()` llama `supabase.auth.getSession()` una vez + suscribe `onAuthStateChange` de forma **sincrónica** (sin await en callback); `signIn(email, password)` con `supabase.auth.signInWithPassword`; `signOut()` con `supabase.auth.signOut`
- [x] T031 [US2] Crear `src/pages/admin/AdminLogin.tsx`: formulario con `useForm` (RHF v7 + Zod schema: email valid, password min 6); `onSubmit` llama `useAuthStore.signIn()` + redirect a `/admin` en éxito; muestra mensaje de error inline si falla (`'Credenciales inválidas'`); botón disabled durante loading
- [x] T032 [US2] Crear `src/components/shared/ProtectedRoute.tsx`: llama `useAuthStore.initialize()` en `useEffect` si `!initialized`; muestra `LoadingSkeleton` mientras `!initialized`; si `!session` → `<Navigate to="/admin/login" replace />`; si `session` → `<Outlet />` o `children`
- [x] T033 [P] [US2] Crear `src/components/admin/AdminSidebar.tsx`: links de navegación a `/admin` (Dashboard), `/admin/profile` (Perfil), `/admin/projects` (Proyectos), `/admin/certifications` (Certificaciones), `/admin/skills` (Skills); botón "Cerrar sesión" que llama `useAuthStore.signOut()` + redirect a `/admin/login`
- [x] T034 [US2] Crear `src/components/admin/AdminLayout.tsx`: layout con `<AdminSidebar>` fijo a la izquierda + área de contenido con `<Outlet />`; responsive: sidebar colapsable en mobile
- [x] T035 [P] [US2] Crear `src/pages/admin/AdminDashboard.tsx`: pantalla de bienvenida con cards de acceso rápido a cada sección admin (Proyectos, Perfil, Certificaciones, Skills)
- [x] T036 [US2] Crear `src/App.tsx` con rutas protegidas `/admin` → `<ProtectedRoute>` → `<AdminLayout>` con rutas anidadas

**Checkpoint**: Login funciona, layout admin visible, logout limpia sesión. `/admin/projects` sin auth redirige a login.

---

## Phase 5: User Story 3 — Admin gestiona proyectos (Priority: P3)

**Goal**: CRUD completo de proyectos desde el panel, toggle published, upload de thumbnail.

**Independent Test**: Crear proyecto con imagen → ver en lista admin → toggle published → verificar visibilidad en `http://localhost:5173/#projects` → eliminar con confirmación.

### Implementation

- [x] T037 [US3] Crear `src/hooks/useImageUpload.ts`: hook `useImageUpload(folder: 'avatars' | 'projects' | 'certifications')` que retorna `{ upload: (file: File) => Promise<string>, uploading: boolean, error: string | null }`
- [x] T038 [P] [US3] Crear `src/components/admin/ImageUpload.tsx`: props `folder`, `currentUrl?: string`, `onUpload: (url: string) => void`; renderiza `<input type="file" accept="image/*">` + preview de imagen actual/nueva; muestra progreso con `uploading` state
- [x] T039 [US3] Crear `src/stores/useAdminStore.ts` con actions de proyectos: `createProject`, `updateProject`, `deleteProject`, `togglePublished`; cada action invalida `usePortfolioStore.fetchProjects()` al completar
- [x] T040 [US3] Crear `src/components/admin/ProjectForm.tsx`: RHF v7 + Zod schema; campo `tags` con chips; `<ImageUpload folder="projects">` para thumbnail; botón submit con estado loading
- [x] T041 [US3] Crear `src/pages/admin/AdminProjectsPage.tsx`: lista todos los proyectos; toggle published; editar/eliminar con confirmación; botón "Agregar proyecto"
- [x] T042 [US3] Rutas `/admin/projects` configuradas en App.tsx + link en AdminSidebar.tsx ✅

**Checkpoint**: Crear proyecto con imagen → verlo en lista con thumbnail → toggle published → aparece en portfolio público → eliminar con confirmación → desaparece.

---

## Phase 6: User Story 4 — Admin gestiona su perfil personal (Priority: P4)

**Goal**: El admin puede editar todos los campos del perfil (incluyendo avatar) y los cambios se reflejan en la sección Hero.

**Independent Test**: Modificar el campo bio en `/admin/profile` → guardar → navegar a `http://localhost:5173/#hero` → verificar que el texto cambió.

### Implementation

- [x] T043 [US4] `updateProfile(data: ProfileFormData): Promise<void>` en `src/stores/useAdminStore.ts`: hace `upsert` en tabla `profile`, luego llama `usePortfolioStore.fetchProfile()`
- [x] T044 [US4] Crear `src/pages/admin/AdminProfilePage.tsx`: carga datos actuales del perfil via `usePortfolioStore`; formulario con RHF v7 + Zod; `<ImageUpload folder="avatars">` para avatar; botón guardar con loading state
- [x] T045 [US4] Ruta `/admin/profile` configurada en App.tsx + link visible en AdminSidebar.tsx ✅

**Checkpoint**: Cambiar nombre + avatar en `/admin/profile` → guardar → verificar en `/#hero` que cambios son visibles sin recargar la app.

---

## Phase 7: User Story 5 — Admin gestiona certificaciones (Priority: P5)

**Goal**: CRUD completo de certificaciones desde el panel.

**Independent Test**: Crear certificación con categoría "Cloud" → verificar que aparece bajo "Cloud" en `http://localhost:5173/#certifications`.

### Implementation

- [x] T046 [US5] Actions de certificaciones en `src/stores/useAdminStore.ts`: `createCertification`, `updateCertification`, `deleteCertification`; invalidan `usePortfolioStore.fetchCertifications()` al completar
- [x] T047 [P] [US5] Crear `src/components/admin/CertificationForm.tsx`: RHF v7 + Zod; `<ImageUpload folder="certifications">` para imagen
- [x] T048 [US5] Crear `src/pages/admin/AdminCertificationsPage.tsx`: lista certificaciones agrupadas por categoría; CRUD completo
- [x] T049 [US5] Ruta `/admin/certifications` configurada en App.tsx + link en AdminSidebar.tsx ✅

**Checkpoint**: Crear certificación con categoría "Frontend" → aparece bajo "Frontend" en portfolio público → eliminar → desaparece.

---

## Phase 8: User Story 6 — Admin gestiona skills (Priority: P6)

**Goal**: CRUD completo de skills desde el panel, agrupados por categoría.

**Independent Test**: Agregar skill "Docker" en categoría "DevOps" → verificar que aparece bajo "DevOps" en `http://localhost:5173/#skills`.

### Implementation

- [x] T050 [US6] Actions de skills en `src/stores/useAdminStore.ts`: `createSkill`, `updateSkill`, `deleteSkill`; invalidan `usePortfolioStore.fetchSkills()` al completar
- [x] T051 [P] [US6] Crear `src/components/admin/SkillForm.tsx`: RHF v7 + Zod; level select (beginner/intermediate/advanced/expert)
- [x] T052 [US6] Crear `src/pages/admin/AdminSkillsPage.tsx`: lista skills agrupados por categoría; CRUD completo
- [x] T053 [US6] Ruta `/admin/skills` configurada en App.tsx + link en AdminSidebar.tsx ✅

**Checkpoint**: Agregar skill "GraphQL" con nivel "intermediate" → aparece en categoría correcta en portfolio público.

---

## Phase 9: User Story 7 — Visitante contacta al dueño (Priority: P7)

**Goal**: Botón de copiar email funcional; formulario EmailJS opcional integrado.

**Independent Test**: (1) Click en "Copiar email" → verificar que el email se copió al portapapeles y aparece feedback visual. (2) Completar formulario → Submit → verificar email recibido en bandeja del dueño.

### Implementation

- [x] T054 [US7] `copyEmail()` en `src/components/public/ContactSection.tsx`: `navigator.clipboard.writeText(profile?.email ?? '')` + estado `copied: boolean` que muestra "¡Copiado!" por 2 segundos
- [x] T055 [P] [US7] Crear `src/components/public/ContactForm.tsx`: RHF v7 + Zod schema; `onSubmit` llama `emailjs.send(...)`; estados `'idle' | 'sending' | 'sent' | 'error'`; reset del form al enviar exitosamente
- [x] T056 [US7] `<ContactForm />` integrado en `src/components/public/ContactSection.tsx` ✅

**Checkpoint**: Copiar email funciona con feedback visual. Formulario envía email y muestra confirmación. `.env` con claves de EmailJS configuradas.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Estados edge case, SEO, performance y preparación para deploy.

- [x] T057 Loading skeletons en `src/pages/public/PublicPortfolio.tsx`: mientras `usePortfolioStore.loading === true`, mostrar `<LoadingSkeleton className="h-96" />` por sección
- [x] T058 [P] Empty states en `src/components/public/ProjectsSection.tsx`, `CertificationsSection.tsx`, `SkillsSection.tsx`: si no hay contenido publicado, mostrar mensaje descriptivo
- [x] T059 [P] Error state en `src/pages/public/PublicPortfolio.tsx`: si `usePortfolioStore.error !== null`, mostrar banner de error con mensaje amigable y botón reintentar
- [x] T060 [P] Validación de tamaño de imagen en `src/utils/imageUpload.ts`: si `file.size > maxSizeMB * 1024 * 1024`, lanzar error `'La imagen no puede superar 2MB'` antes del upload ✅ (ya implementado)
- [x] T061 `index.html` actualizado con `<title>`, meta description, og:title, og:description, og:type, theme-color ✅
- [x] T062 [P] Favicon personalizado en `public/favicon.svg` + `<link rel="icon">` en `index.html` ✅
- [x] T063 `src/stores/useAuthStore.ts` verificado: `autoRefreshToken: true`, `persistSession: true`, `detectSessionInUrl: false` en `createClient` options ✅
- [x] T064 [P] `.env.example` verificado con todas las variables requeridas ✅
- [x] T065 [P] Configuración SPA routing: `public/_redirects` (Netlify) + `vercel.json` (Vercel) creados ✅
- [x] T066 `pnpm build` ejecutado sin errores TypeScript ✅ | `pnpm typecheck` limpio ✅

---

## Dependencies & Execution Order

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-10 (User Stories)

T009-T011 (DB): Manual — ejecutar en Supabase SQL Editor antes de correr la app
T012-T019: Código base — bloqueante para todo lo demás
T020-T029: US1 MVP — requiere T009-T019
T030-T036: US2 Auth — puede desarrollarse en paralelo con US1
T037-T042: US3 Projects — requiere T030-T036 (auth) + T009 (DB)
T043-T045: US4 Profile — requiere T037-T039 (admin store)
T046-T049: US5 Certs — puede correr en paralelo con US3 y US4
T050-T053: US6 Skills — puede correr en paralelo con US3, US4, US5
T054-T056: US7 Contact — requiere T020-T029 (ContactSection base)
T057-T066: Polish — al final, cuando todo el contenido funciona
```

## Implementation Status

**Total**: 66 tasks | **Completed**: 60 ✅ | **Pending (manual/DB)**: 3 | **Remaining**: 3

### Pending manual tasks (ejecutar en Supabase):
- T009: Ejecutar `supabase-schema.sql` en SQL Editor
- T010: Ejecutar `rls-policies.sql` en SQL Editor
- T011: Ejecutar `storage-policy.sql` en SQL Editor
