-- ============================================================
-- Portfolio Personal — RLS Policies
-- Feature: 001-portfolio-personal
-- Date: 2026-03-11
--
-- Strategy: lectura pública para todos (anon + authenticated)
--           escritura solo para usuarios authenticated
--           (el único usuario authenticated es el admin)
-- ============================================================

-- ============================================================
-- Drop existing policies (idempotent re-run)
-- ============================================================
drop policy if exists "profile: public read"              on public.profile;
drop policy if exists "profile: admin update"             on public.profile;
drop policy if exists "profile: admin insert"             on public.profile;
drop policy if exists "projects: public read published"   on public.projects;
drop policy if exists "projects: admin read all"          on public.projects;
drop policy if exists "projects: admin insert"            on public.projects;
drop policy if exists "projects: admin update"            on public.projects;
drop policy if exists "projects: admin delete"            on public.projects;
drop policy if exists "certifications: public read"       on public.certifications;
drop policy if exists "certifications: admin insert"      on public.certifications;
drop policy if exists "certifications: admin update"      on public.certifications;
drop policy if exists "certifications: admin delete"      on public.certifications;
drop policy if exists "skills: public read"               on public.skills;
drop policy if exists "skills: admin insert"              on public.skills;
drop policy if exists "skills: admin update"              on public.skills;
drop policy if exists "skills: admin delete"              on public.skills;

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
alter table public.profile        enable row level security;
alter table public.projects       enable row level security;
alter table public.certifications enable row level security;
alter table public.skills         enable row level security;

-- ============================================================
-- TABLE: profile
-- ============================================================

-- Lectura pública — visitantes pueden ver el perfil
create policy "profile: public read"
  on public.profile
  for select
  to anon, authenticated
  using (true);

-- Solo admin autenticado puede actualizar el perfil
create policy "profile: admin update"
  on public.profile
  for update
  to authenticated
  using (true)
  with check (true);

-- Solo admin autenticado puede insertar (setup inicial)
create policy "profile: admin insert"
  on public.profile
  for insert
  to authenticated
  with check (true);

-- ============================================================
-- TABLE: projects
-- ============================================================

-- Visitantes solo ven proyectos publicados
create policy "projects: public read published"
  on public.projects
  for select
  to anon
  using (published = true);

-- Admin ve todos los proyectos (publicados y borradores)
create policy "projects: admin read all"
  on public.projects
  for select
  to authenticated
  using (true);

-- Admin puede crear proyectos
create policy "projects: admin insert"
  on public.projects
  for insert
  to authenticated
  with check (true);

-- Admin puede actualizar proyectos
create policy "projects: admin update"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

-- Admin puede eliminar proyectos
create policy "projects: admin delete"
  on public.projects
  for delete
  to authenticated
  using (true);

-- ============================================================
-- TABLE: certifications
-- ============================================================

-- Lectura pública — todas las certificaciones son visibles
create policy "certifications: public read"
  on public.certifications
  for select
  to anon, authenticated
  using (true);

-- Admin puede crear certificaciones
create policy "certifications: admin insert"
  on public.certifications
  for insert
  to authenticated
  with check (true);

-- Admin puede actualizar certificaciones
create policy "certifications: admin update"
  on public.certifications
  for update
  to authenticated
  using (true)
  with check (true);

-- Admin puede eliminar certificaciones
create policy "certifications: admin delete"
  on public.certifications
  for delete
  to authenticated
  using (true);

-- ============================================================
-- TABLE: skills
-- ============================================================

-- Lectura pública — todos los skills son visibles
create policy "skills: public read"
  on public.skills
  for select
  to anon, authenticated
  using (true);

-- Admin puede crear skills
create policy "skills: admin insert"
  on public.skills
  for insert
  to authenticated
  with check (true);

-- Admin puede actualizar skills
create policy "skills: admin update"
  on public.skills
  for update
  to authenticated
  using (true)
  with check (true);

-- Admin puede eliminar skills
create policy "skills: admin delete"
  on public.skills
  for delete
  to authenticated
  using (true);

-- ============================================================
-- NOTAS DE IMPLEMENTACIÓN
-- ============================================================
-- 1. La estrategia "authenticated = admin" es válida porque NO existe
--    registro público. El único usuario authenticated es el dueño.
--
-- 2. Si en el futuro se necesita un segundo admin, cambiar a verificación
--    explícita de UID: `using (auth.uid() = '<admin-uid>')`
--
-- 3. Para habilitar el rol anon en Supabase, asegurarse de que
--    el cliente usa la anon key (no la service_role key) en el frontend.
--
-- 4. Verificar políticas con:
--    SELECT * FROM pg_policies WHERE schemaname = 'public';
-- ============================================================
