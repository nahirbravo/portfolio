# Data Model: Portfolio Personal

**Feature**: 001-portfolio-personal | **Version**: 1.0 | **Date**: 2026-03-11

---

## Entities

### 1. `profile`

Perfil personal del dueño del portfolio. Tabla singleton — siempre hay exactamente 1 fila.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK, `gen_random_uuid()` |
| `name` | `text` | NO | Nombre completo |
| `title` | `text` | NO | Título profesional ("Sr. Frontend Developer", etc.) |
| `bio` | `text` | NO | Texto de presentación (puede ser largo) |
| `email` | `text` | NO | Email de contacto (visible en portfolio) |
| `linkedin_url` | `text` | SÍ | URL perfil LinkedIn |
| `github_url` | `text` | SÍ | URL perfil GitHub |
| `avatar_url` | `text` | SÍ | URL pública en Supabase Storage |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()`, actualizar en cada UPDATE |

**Validaciones**:
- `name`: no vacío, max 100 chars
- `title`: no vacío, max 100 chars
- `bio`: no vacío, max 2000 chars
- `email`: formato email válido
- `linkedin_url`, `github_url`: URL válida o null
- `avatar_url`: URL válida o null (Supabase Storage public URL)

**Estado**: Singleton — no hay insert/delete desde admin, solo update.

---

### 2. `projects`

Proyectos del portfolio. Pueden publicarse o despublicarse sin eliminarlos.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK, `gen_random_uuid()` |
| `title` | `text` | NO | Nombre del proyecto |
| `description` | `text` | NO | Descripción (puede ser larga) |
| `preview_url` | `text` | SÍ | URL del demo/preview |
| `repo_url` | `text` | SÍ | URL del repositorio |
| `tags` | `text[]` | NO | Array de tecnologías/tags, default `'{}'` |
| `thumbnail_url` | `text` | SÍ | URL imagen en Supabase Storage |
| `featured` | `boolean` | NO | Si aparece en posición destacada, default `false` |
| `published` | `boolean` | NO | Si es visible en el portfolio público, default `false` |
| `sort_order` | `integer` | NO | Orden de visualización, default `0` |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` |

**Validaciones**:
- `title`: no vacío, max 150 chars
- `description`: no vacío, max 2000 chars
- `preview_url`, `repo_url`: URL válida o null
- `tags`: array de strings, max 15 tags, cada tag max 30 chars
- `sort_order`: integer >= 0

**Estado**:
- `published: false` → borrador, visible solo en admin
- `published: true` → visible en portfolio público
- `featured: true` → tarjeta grande en ProjectsSection

**Notas**:
- El portfolio público solo muestra `WHERE published = true`
- En admin se muestran todos (publicados y borradores)

---

### 3. `certifications`

Certificaciones y cursos completados.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK, `gen_random_uuid()` |
| `title` | `text` | NO | Nombre de la certificación |
| `institution` | `text` | NO | Institución emisora |
| `issued_at` | `date` | NO | Fecha de emisión |
| `credential_url` | `text` | SÍ | Link al certificado online |
| `image_url` | `text` | SÍ | URL imagen en Supabase Storage |
| `category` | `text` | NO | Categoría ("Cloud", "Frontend", "Backend", "DevOps", etc.) |
| `sort_order` | `integer` | NO | Orden dentro de la categoría, default `0` |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` |

**Validaciones**:
- `title`: no vacío, max 200 chars
- `institution`: no vacío, max 150 chars
- `issued_at`: fecha válida, no futura
- `credential_url`: URL válida o null
- `category`: no vacío, max 50 chars

---

### 4. `skills`

Skills técnicos agrupados por categoría.

| Campo | Tipo | Nullable | Descripción |
|-------|------|----------|-------------|
| `id` | `uuid` | NO | PK, `gen_random_uuid()` |
| `name` | `text` | NO | Nombre del skill ("React", "TypeScript", etc.) |
| `category` | `text` | NO | Agrupación ("Frontend", "Backend", "Mobile", "DevOps", etc.) |
| `icon` | `text` | SÍ | Nombre de ícono o emoji |
| `level` | `text` | NO | `'beginner' | 'intermediate' | 'advanced' | 'expert'` |
| `sort_order` | `integer` | NO | Orden dentro de la categoría, default `0` |
| `created_at` | `timestamptz` | NO | Default: `now()` |
| `updated_at` | `timestamptz` | NO | Default: `now()` |

**Validaciones**:
- `name`: no vacío, max 50 chars
- `category`: no vacío, max 50 chars
- `level`: uno de `['beginner', 'intermediate', 'advanced', 'expert']`

---

## Relationships

```text
profile (1) ─────── standalone (no FK a otras tablas)
projects (N) ─────── standalone
certifications (N) ── standalone
skills (N) ─────────── standalone
```

No hay relaciones FK entre tablas — el portfolio es un showcase flat. Todas las entidades son independientes.

---

## Storage: `portfolio-images` bucket

| Path pattern | Contenido | Ejemplo |
|-------------|-----------|---------|
| `avatars/<uuid>.<ext>` | Avatar del perfil | `avatars/abc-123.jpg` |
| `projects/<uuid>.<ext>` | Thumbnail de proyecto | `projects/def-456.png` |
| `certifications/<uuid>.<ext>` | Imagen de certificación | `certifications/ghi-789.jpg` |

- Bucket: `portfolio-images`, público (URLs accesibles sin auth)
- Max file size: 5MB por imagen
- Allowed types: `image/jpeg`, `image/png`, `image/webp`

---

## State Transitions

### projects.published

```
[created] ──publish──→ [published] ──unpublish──→ [draft]
                              ↑                        │
                              └──────publish───────────┘
[any state] ──delete──→ [deleted from DB]
```

No hay soft delete — los proyectos eliminados se borran de la DB. Las imágenes en Storage deben eliminarse manualmente o via cascade en el hook de admin.

---

## Seed Data (Fase 2)

Mínimo requerido para verificar el schema:
- 1 perfil de ejemplo con todos los campos
- 3 proyectos (1 featured+published, 1 published, 1 draft)
- 3 certificaciones (2 categorías distintas)
- 6 skills (3 categorías: Frontend, Backend, Mobile)
