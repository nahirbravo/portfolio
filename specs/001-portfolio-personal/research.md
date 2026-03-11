# Research: Portfolio Personal

**Feature**: 001-portfolio-personal | **Date**: 2026-03-11

El plan de usuario fue completo y bien especificado — no hubo NEEDS CLARIFICATION.
Este documento registra las decisiones técnicas de las tecnologías del stack con
rationale, alternativas y snippets de referencia para la implementación.

---

## Decision 1: Tailwind CSS v4 + Vite — Setup sin tailwind.config.ts

**Decision**: Usar `@tailwindcss/vite` plugin. No se necesita `tailwind.config.ts` ni `postcss.config.js`. Toda la customización de tokens (colores, fuentes) va en el CSS principal via `@theme {}`.

**Rationale**: Tailwind v4 es CSS-first. El plugin de Vite reemplaza PostCSS completamente. La detección de contenido es automática. `@theme` en CSS genera las clases utilitarias custom directamente.

**Alternativas consideradas**:
- Mantener `tailwind.config.ts` con `@config` directive — posible pero redundante, solo recomendado para migraciones desde v3.
- PostCSS standalone — no necesario con el plugin de Vite.

**Setup**:
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({ plugins: [react(), tailwindcss()] })
```
```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-bg-base: #0A0A0F;        /* Principio II: fondo oscuro */
  --color-accent-cyan: oklch(75% 0.18 195);
  --color-accent-violet: oklch(65% 0.22 290);
  --font-sans: 'Inter', sans-serif;
}
```
**Instalación**: `pnpm add tailwindcss @tailwindcss/vite`

---

## Decision 2: Supabase RLS — Estrategia single-admin

**Decision**: Usar `TO authenticated` en políticas de escritura como primera iteración. Para mayor seguridad, restringir a `auth.uid() = '<ADMIN_UID>'::uuid` una vez que el usuario admin esté creado en Supabase Auth.

**Rationale**: La estrategia `authenticated = admin` es válida porque no existe registro público. El único usuario `authenticated` posible es el dueño. Hardcodear el UID añade una capa extra de defensa en profundidad.

**Alternativas consideradas**:
- `TO authenticated` simple — suficiente mientras no exista registro público, más fácil de setup inicial.
- Claims JWT custom (roles en metadata) — over-engineering para un solo admin.
- Service role en frontend — PROHIBIDO, expone permisos totales.

**Patrón recomendado para producción**:
```sql
CREATE POLICY "admin_write" ON projects
  FOR ALL TO authenticated
  USING (auth.uid() = '<YOUR_ADMIN_UID>'::uuid)
  WITH CHECK (auth.uid() = '<YOUR_ADMIN_UID>'::uuid);
```
> Reemplazar `<YOUR_ADMIN_UID>` después de crear el usuario admin en Supabase Auth.

---

## Decision 3: Supabase Auth — Session initialization en React

**Decision**: `getSession()` una sola vez al iniciar la app para el estado inicial. `onAuthStateChange` como fuente de verdad para cambios posteriores. El callback de `onAuthStateChange` DEBE ser sincrónico — no usar `async/await` dentro.

**Rationale**: `onAuthStateChange` maneja el token refresh automáticamente. Llamadas async dentro del callback pueden causar condiciones de carrera o deadlock en React 18 concurrent mode.

**Patrón**:
```ts
// En useAuthStore.initialize():
const { data: { session } } = await supabase.auth.getSession()
set({ session, user: session?.user ?? null, initialized: true })

const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    set({ session, user: session?.user ?? null }) // sync, no awaits
  }
)
// Guardar subscription para cleanup
```

---

## Decision 4: Fetching de datos — Zustand async (sin TanStack Query)

**Decision**: Usar Zustand con patrón async explícito (loading/error en el store) para todos los datos de portfolio. No añadir TanStack Query — el plan original lo omitió y la complejidad adicional no se justifica para un portfolio personal.

**Rationale**: TanStack Query añadiría caching sofisticado y deduplicación de requests, pero para una app con un solo usuario admin y datos estáticos (proyectos, skills), Zustand puro es suficiente. El equipo decidió no añadir dependencias no planeadas (principio de no over-engineering).

**Alternativas consideradas**:
- TanStack Query — mejor cache, pero dependencia extra no en el plan original.
- SWR — igual de poderoso pero también fuera del plan.
- useState local + useEffect — más verbose, sin estado compartido.

**Patrón Zustand v5 async**:
```ts
// IMPORTANTE en Zustand v5: useShallow es obligatorio para selectores multi-campo
import { useShallow } from 'zustand/shallow'

const { projects, loading } = usePortfolioStore(
  useShallow((s) => ({ projects: s.projects, loading: s.loading }))
)
```

---

## Decision 5: Zustand v5 — Breaking changes a tener en cuenta

**Decision**: Siempre usar `useShallow` para selectores que retornan objetos o múltiples valores. Sin `useShallow`, en v5 el componente re-renderiza en cada cambio de estado aunque los valores no cambien.

**Cambios principales v4 → v5**:
| Cambio | v4 | v5 |
|--------|----|----|
| Comparación default | shallow en algunos casos | `Object.is` estricto |
| Selectores multi-campo | funcionaban sin wrapper | requieren `useShallow` |
| React mínimo | 16+ | 18+ |
| `persist` initial write | automático | eliminado |

---

## Decision 6: Framer Motion — Scroll animations con stagger

**Decision**: Usar `variants` con `staggerChildren` en el contenedor y `whileInView` + `viewport={{ once: true }}` para disparar al hacer scroll. Intervalo de stagger entre `0.05s` y `0.1s`.

**Rationale**: `once: true` evita re-ejecución al volver a hacer scroll — mejor UX y performance. `viewport={{ amount: 0.2 }}` garantiza que la animación solo dispara cuando el elemento es realmente visible.

**Caveats**:
- Evitar `whileInView` en listas de +50 items (usar `useInView` manual con virtualización).
- No combinar con `transition: { repeat: Infinity }`.

**Patrón**:
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

<motion.ul
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {items.map((item) => (
    <motion.li key={item.id} variants={itemVariants}>...</motion.li>
  ))}
</motion.ul>
```

---

## Decision 7: EmailJS — Integración con React Hook Form v7

**Decision**: Usar `emailjs.send()` con los datos validados del `handleSubmit` de RHF. NO usar `emailjs.sendForm()` con `useRef` — ese es el patrón legacy que bypasea la validación de Zod.

**Variables de entorno** (añadir a `.env.example`):
```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

**Patrón**:
```ts
const onSubmit = async (data: ContactFormData) => {
  await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    { from_name: data.name, from_email: data.email, message: data.message },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  )
}
```

---

## Resumen de decisiones

| Tema | Decisión | Riesgo |
|------|----------|--------|
| Tailwind v4 setup | `@tailwindcss/vite` + `@theme` en CSS, sin config.ts | Bajo — API estable en v4 final |
| RLS admin | `TO authenticated` → migrar a UID específico en prod | Medio — mitigar creando admin antes que cualquier otro usuario |
| Auth session | `getSession()` una vez + `onAuthStateChange` sync | Bajo — patrón oficial Supabase |
| Fetching | Zustand async (sin TanStack Query) | Bajo — suficiente para portfolio |
| Zustand v5 | `useShallow` obligatorio en multi-field selectors | Bajo — errores son silenciosos pero detectables con devtools |
| Animaciones | `whileInView` + `viewport={{ once: true }}` | Bajo — patrón estándar Framer Motion |
| EmailJS | `emailjs.send()` con datos RHF, no `sendForm` | Bajo — patrón moderno documentado |
