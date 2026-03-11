-- ============================================================
-- Portfolio Personal — Supabase Storage Policies
-- Feature: 001-portfolio-personal
-- Date: 2026-03-11
--
-- Bucket: portfolio-images (public)
-- Acceso: lectura pública para todos, escritura solo admin auth
-- ============================================================

-- ============================================================
-- PASO 1: Crear el bucket via Supabase Dashboard o SQL
-- ============================================================
-- Opción A — Dashboard: Storage → New Bucket → nombre: "portfolio-images", public: true
--
-- Opción B — SQL (requiere estar conectado como service_role):
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,                                          -- bucket público
  5242880,                                       -- 5MB max por archivo
  array['image/jpeg', 'image/png', 'image/webp'] -- solo imágenes
)
on conflict (id) do nothing;

-- ============================================================
-- PASO 2: Storage policies
-- ============================================================

-- Lectura pública — cualquiera puede descargar/ver imágenes
create policy "portfolio-images: public read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'portfolio-images');

-- Solo admin autenticado puede subir imágenes
create policy "portfolio-images: admin upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'portfolio-images'
    -- Estructura de paths permitidos: avatars/*, projects/*, certifications/*
    and (
      name ~ '^avatars/'
      or name ~ '^projects/'
      or name ~ '^certifications/'
    )
  );

-- Solo admin autenticado puede actualizar imágenes (upsert/replace)
create policy "portfolio-images: admin update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-images')
  with check (bucket_id = 'portfolio-images');

-- Solo admin autenticado puede eliminar imágenes
create policy "portfolio-images: admin delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-images');

-- ============================================================
-- NOTAS DE IMPLEMENTACIÓN
-- ============================================================
-- 1. Con bucket público, las URLs son accesibles directamente:
--    https://<project>.supabase.co/storage/v1/object/public/portfolio-images/<path>
--
-- 2. Pattern de path en el código TypeScript:
--    - Avatares:  `avatars/${userId}-${Date.now()}.${ext}`
--    - Proyectos: `projects/${projectId}-${Date.now()}.${ext}`
--    - Certs:     `certifications/${certId}-${Date.now()}.${ext}`
--
-- 3. Al eliminar una entidad (proyecto, certificación), eliminar también
--    la imagen en Storage para evitar orphaned files:
--    await supabase.storage.from('portfolio-images').remove([imagePath])
--
-- 4. Generar URL pública:
--    const { data } = supabase.storage.from('portfolio-images').getPublicUrl(path)
--    // data.publicUrl es la URL completa
-- ============================================================
