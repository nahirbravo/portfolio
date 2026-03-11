# Quickstart: Portfolio Personal

**Feature**: 001-portfolio-personal | **Date**: 2026-03-11

---

## Prerequisitos

- Node.js 20+
- pnpm 9+ (`npm install -g pnpm`)
- Cuenta en [Supabase](https://supabase.com) (plan gratuito suficiente)
- Cuenta en [EmailJS](https://emailjs.com) (plan gratuito: 200 emails/mes)

---

## Setup en 5 pasos

### Paso 1 — Crear el proyecto

```bash
# Crear proyecto Vite + React + TypeScript
pnpm create vite@latest portfolio -- --template react-ts
cd portfolio

# Instalar dependencias de producción
pnpm add \
  @supabase/supabase-js \
  zustand \
  react-router-dom \
  react-hook-form \
  @hookform/resolvers \
  zod \
  framer-motion \
  @emailjs/browser

# Instalar dependencias de desarrollo
pnpm add -D tailwindcss @tailwindcss/vite @types/node

# Verificar que todo instaló correctamente
pnpm run dev
```

### Paso 2 — Configurar Tailwind CSS v4

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },  // para imports absolutos @/...
  },
})
```

```css
/* src/index.css — reemplazar el contenido existente */
@import "tailwindcss";

@theme {
  /* Fondo oscuro — Principio II de la Constitución */
  --color-bg-base: #0A0A0F;
  --color-bg-surface: #12121A;
  --color-bg-elevated: #1A1A26;

  /* Acentos */
  --color-accent-cyan: oklch(75% 0.18 195);
  --color-accent-violet: oklch(65% 0.22 290);

  /* Texto */
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #475569;

  /* Tipografía */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### Paso 3 — Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → New Project
2. Elegir nombre, contraseña fuerte, región más cercana
3. Esperar ~2 minutos a que el proyecto se inicialice
4. Copiar las credenciales: **Project URL** y **Anon key** (Settings → API)

### Paso 4 — Configurar variables de entorno

```bash
# Copiar el template
cp .env.example .env
```

```env
# .env — NUNCA commitear este archivo
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

```env
# .env.example — SÍ commitear este archivo (valores placeholder)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

### Paso 5 — Crear schema en Supabase

1. Ir a **Supabase Dashboard → SQL Editor**
2. Ejecutar en orden:
   - `specs/001-portfolio-personal/contracts/supabase-schema.sql` (DDL + seed)
   - `specs/001-portfolio-personal/contracts/rls-policies.sql` (RLS)
   - `specs/001-portfolio-personal/contracts/storage-policy.sql` (Storage)
3. Verificar en **Table Editor** que se crearon las 4 tablas con los datos de seed
4. Verificar en **Storage** que existe el bucket `portfolio-images`

---

## Estructura del cliente Supabase

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

---

## Crear el usuario admin en Supabase Auth

1. **Supabase Dashboard → Authentication → Users → Invite user**
2. Ingresar el email que usarás como admin
3. Aceptar la invitación en el email recibido y establecer contraseña
4. Copiar el UUID del usuario (columna ID en la tabla de usuarios)
5. (Opcional pero recomendado) Actualizar las RLS policies en `rls-policies.sql` para hardcodear el UID:
   ```sql
   -- Reemplazar en todos los policies "for update/insert/delete":
   using (auth.uid() = '<TU_ADMIN_UID>'::uuid)
   ```

---

## Scripts disponibles

```bash
pnpm dev          # Servidor de desarrollo (localhost:5173)
pnpm build        # Build de producción
pnpm preview      # Preview del build de producción
pnpm typecheck    # TypeScript type checking
pnpm lint         # ESLint
```

---

## Verificación de setup

Después de completar los 5 pasos, verificar:

- [ ] `pnpm dev` corre sin errores
- [ ] El cliente Supabase no arroja errores en consola al iniciar
- [ ] La tabla `profile` tiene 1 fila de seed data
- [ ] El bucket `portfolio-images` existe en Storage
- [ ] Puedes hacer login como admin en `/admin`

---

## Troubleshooting frecuente

| Error | Causa | Solución |
|-------|-------|----------|
| `Missing Supabase env vars` | `.env` no creado o mal configurado | Verificar que `.env` existe y tiene las keys correctas |
| `new row violates RLS policy` | Escribiendo con cliente anon en tablas protegidas | Verificar que el usuario está autenticado antes de escribir |
| `relation "public.profile" does not exist` | DDL no ejecutado | Ejecutar `supabase-schema.sql` en SQL Editor |
| `Tailwind classes not applying` | Import faltante | Verificar que `index.css` tiene `@import "tailwindcss"` y está importado en `main.tsx` |
| Login no redirige al admin | `ProtectedRoute` mal configurado | Verificar que `useAuthStore` inicializa la sesión en `App.tsx` |
