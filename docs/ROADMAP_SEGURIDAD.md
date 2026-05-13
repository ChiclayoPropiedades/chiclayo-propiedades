# Roadmap de Seguridad — Fases 2 a 10

> Plan ejecutable para cerrar los 187 hallazgos de la auditoría completa.
> Sesión 8 cerró **Fase 0 + 1 + (parcial) 2 + 3** (~60% del riesgo crítico).
> Este documento detalla las fases restantes.

---

## Estado al cierre de Sesión 8

| Categoría | Cerrados | Pendientes | Bloqueante |
|-----------|----------|------------|------------|
| 🔴 Críticos | 5 / 9 (Fase 0,1,2,3) | H-2.1 server, H-3.2, H-3.3, H-4.x, H-6.x | Trigger SQL + admin-actions split |
| 🟠 Altos | 5 / 51 | 46 | — |
| 🟡 Medios | 0 / 51 | 51 | — |
| 🔵 Bajos | 0 / 23 | 23 | — |

---

## FASE 2 (resto) — Auth y sesiones

### Hallazgos pendientes

| ID | Sev | Descripción | Archivo |
|----|-----|-------------|---------|
| H-2.1 server | 🔴 | Trigger SQL acepta `role` de metadata → privilege escalation visitor→admin | `auth.users` trigger `handle_new_user` |
| H-2.3 | 🟠 | `DashboardLayout` `.single()` sin error handler → 500 si profile no existe | `src/app/dashboard/layout.tsx` |
| H-2.4 | 🟠 | Login form rama null sin signout → sesión zombie | `src/features/auth/components/login-form.tsx` |
| H-2.5 | 🟠 | Sin Zod en signup/login/recovery | `src/features/auth/components/*.tsx` |
| H-2.6+ | 🟡/🔵 | Mensajes de error genéricos, recovery flow incompleto | varios |

### Implementación

1. **H-2.1 server** (TÚ, Dashboard): aplicar trigger SQL con CHECK case (ver `SESION_8_HANDOFF.md` §2.5).
2. **H-2.3**: `DashboardLayout` debe usar `.maybeSingle()` + fallback a `/login` si profile ausente.
3. **H-2.4**: en login-form, branch null (login OK pero getUser retorna null) → `supabase.auth.signOut()` + toast.
4. **H-2.5**: crear `src/features/auth/schemas.ts` con:
   ```ts
   import { z } from "zod"
   export const signupSchema = z.object({
     email: z.string().email(),
     password: z.string().min(8),
     fullName: z.string().min(2).max(80),
     phone: z.string().regex(/^\+?[0-9 ]{8,15}$/),
     role: z.enum(["user", "agent"]),  // NUNCA admin
   })
   ```
   Validar en `handleSubmit` antes de `supabase.auth.signUp`.

### Verificación
- POST a `/auth/v1/signup` con `data.role: 'admin'` → profile creado con `role='user'` (audit query Q1)
- DashboardLayout: usuario sin profile → redirect a `/login`, no 500
- Forms rechazan inputs inválidos antes de network

**Esfuerzo:** 2–3h.

---

## FASE 3 (resto) — Server Actions

### Hallazgos pendientes

| ID | Sev | Descripción | Archivo |
|----|-----|-------------|---------|
| H-3.2 | 🔴 | 13 admin Server Actions sin `verifyAdmin()` | `admin-actions.ts` (1094 líneas) |
| H-3.3 | 🟠 | `admin-actions.ts` debe dividirse | split en 9 archivos |
| H-3.4 | 🟠 | `markPlanAsUsed` silent failure | `publication-actions.ts` |
| H-3.5 | 🟠 | `deleteUser` cascade sin transacción | admin-actions |
| H-3.6 | 🟡 | Sin Zod en 95% Server Actions | varios |

### Implementación (orden crítico)

1. **PRIMERO: Split `admin-actions.ts`** en 9 archivos por dominio (memoria: no agregar más al actual):
   ```
   src/features/admin/services/
   ├── user-management-actions.ts       (deleteUser, updateUserRole, etc.)
   ├── property-management-actions.ts   (admin overrides)
   ├── subscription-actions.ts          (approve/reject plans)
   ├── payment-actions.ts               (refunds, manual payments)
   ├── blog-management-actions.ts
   ├── training-management-actions.ts
   ├── ranking-actions.ts               (recalculateRankings)
   ├── inquiry-actions.ts               (assign leads)
   └── settings-actions.ts              (platform_settings)
   ```
   Mantener `admin-actions.ts` como barrel re-export para no romper imports existentes.

2. **DESPUÉS: aplicar `requireAdmin()`** en cada nueva función — ya tienes el helper en `src/shared/lib/auth/verify-role.ts`:
   ```ts
   export async function deleteUser(userId: string) {
     const auth = await requireAdmin();
     if (!auth.ok) return { error: authErrorMessage(auth.error) };
     // ... lógica
   }
   ```

3. **H-3.5 transacción**: crear función PL/pgSQL `delete_user_cascade(user_id uuid)` que envuelve borrado de profile + properties + subscriptions + inquiries en `BEGIN; ... COMMIT;`. Llamar via `supabase.rpc()`.

4. **H-3.4 markPlanAsUsed**: agregar `if (error) { console.error(...); throw error; }` en lugar de retornar silently.

5. **H-3.6 Zod**: crear `schemas.ts` por feature, validar formData en cada Server Action.

### Verificación
- Agent no-admin que llama `deleteUser('otroId')` → `FORBIDDEN`
- `admin-actions.ts` sigue importable pero re-exporta de los nuevos archivos
- Cada nuevo archivo <300 líneas
- `deleteUser` rollback si una operación intermedia falla

**Esfuerzo:** 8–10h.

---

## FASE 4 — Performance, Cache, ISR

### Hallazgos

| ID | Sev | Descripción | Archivo |
|----|-----|-------------|---------|
| H-4.1 | 🔴 | `force-dynamic` rompe ISR en `/capacitaciones/[slug]` | `src/app/(main)/capacitaciones/[slug]/page.tsx` |
| H-4.2 | 🔴 | `sitemap.ts` con cookies → regenera cada request | `src/app/sitemap.ts` |
| H-4.3 | 🔴 | Mutations blog/training no invalidan ISR | `src/features/{blog,trainings}/services/*` |
| H-4.4 | 🟠 | 6 páginas sin `revalidate` | varios |
| H-4.5 | 🟠 | Duplicate queries `generateMetadata` + page | detail pages |

### Implementación

1. Quitar `force-dynamic` de capacitaciones detail → separar:
   - Data pública (titulo, precio, descripción) en Server Component con `revalidate: 300`
   - Data autenticada (botón inscripción según rol) en Client Component dentro de `<Suspense>`
2. `sitemap.ts` → reemplazar `createClient()` (con cookies) por `createPublicClient()` (sin cookies, ya existe).
3. `revalidatePath` en `createBlogPost`, `updateBlogPost`, `deleteBlogPost`, `createTraining`, `updateTraining`, `deleteTraining`.
4. `React.cache()` en `getPropertyBySlug`, `getBlogPostBySlug` para dedup metadata + page.

### Verificación
- `next build` muestra `○ (Static)` o `●  (SSG)` en blog/capacitaciones detail
- Vercel Analytics: TTFB <200ms en páginas públicas
- Lighthouse Performance ≥90 mobile

**Esfuerzo:** 4–6h.

---

## FASE 5 — Arquitectura y Convenciones

### Hallazgos

| ID | Sev | Descripción |
|----|-----|-------------|
| H-5.1 | 🔴 | `UserProfile`/`AdminProfile` duplicados con divergencia |
| H-5.2 | 🔴 | 80+ magic strings (roles, status, types) |
| H-5.3 | 🟠 | Cross-feature imports acoplan dominios |
| H-5.5 | 🟠 | `as any` en `get-posts.ts:26, 53` |
| H-5.6 | 🟠 | `src/shared/types/` y `src/shared/constants/` vacíos |

### Implementación

1. Crear `src/shared/types/`:
   - `user.ts`: `UserRole`, `UserProfile`, `AdminProfile`
   - `property.ts`: `Property`, `PropertyType`, `PropertyStatus`, `Operation`
   - `subscription.ts`, `payment.ts`, etc.
2. Crear `src/shared/constants/`:
   - `enums.ts`: `USER_ROLES = ['user','agent','admin'] as const`, etc.
   - `labels.ts`: mapas ES (`USER_ROLE_LABEL: Record<UserRole, string>`)
3. Reemplazar magic strings → import from constants.
4. Crear `src/features/_orchestration/` para flujos multi-feature (admin views).
5. Quitar `as any` de `get-posts.ts` (definir tipo correcto).

### Verificación
- `grep -r "'admin'\|'agent'\|'user'" src/` solo en `enums.ts`
- `npx tsc --noEmit` sin warnings `any`

**Esfuerzo:** 6–8h.

---

## FASE 6 — Base de Datos, RLS, Queries

### Hallazgos

| ID | Sev | Descripción |
|----|-----|-------------|
| H-6.1 | 🔴 | `profiles.role` TEXT sin CHECK |
| H-6.2 | 🔴 | Trigger sin validación (cubierto por H-2.1) |
| H-6.3 | 🔴 | Drift SQL backup vs prod |
| H-6.5 | 🔴 | `platform_settings` RLS `USING (true)` (público) |
| H-6.6 | 🔴 | `publication_requests` sin policies |
| H-6.10 | 🟠 | `currency`, `email` sin CHECK |
| H-6.13 | 🟠 | Payment IDs sin UNIQUE |
| H-6.15+ | 🟡 | Índices faltantes |

### Implementación (Supabase Dashboard / Management API — fuera de Claude)

```sql
-- H-6.1: enum + CHECK en role (después de H-2.1 trigger fix)
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
ALTER TABLE profiles ALTER COLUMN role TYPE user_role USING role::user_role;
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- H-6.10: currency
ALTER TABLE properties ADD CONSTRAINT properties_currency_check
  CHECK (currency IN ('PEN', 'USD'));

-- H-6.13: UNIQUE en payment IDs (previene doble cobro)
CREATE UNIQUE INDEX idx_subs_stripe_session ON agent_subscriptions(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE UNIQUE INDEX idx_subs_mp_payment ON agent_subscriptions(mp_payment_id) WHERE mp_payment_id IS NOT NULL;
CREATE UNIQUE INDEX idx_enroll_stripe_session ON training_enrollments(stripe_session_id) WHERE stripe_session_id IS NOT NULL;
CREATE UNIQUE INDEX idx_enroll_mp_payment ON training_enrollments(mp_payment_id) WHERE mp_payment_id IS NOT NULL;

-- H-6.5: platform_settings granular
ALTER TABLE platform_settings ADD COLUMN is_public BOOLEAN DEFAULT false;
DROP POLICY IF EXISTS platform_settings_select_all ON platform_settings;
CREATE POLICY platform_settings_public_read ON platform_settings
  FOR SELECT USING (is_public = true);
CREATE POLICY platform_settings_admin_all ON platform_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- H-6.15: índices hot columns
CREATE INDEX idx_properties_status_created ON properties(status, created_at DESC);
CREATE INDEX idx_inquiries_property ON inquiries(property_id, created_at DESC);
CREATE INDEX idx_profiles_email ON profiles(email);
```

### Verificación
- `supabase get_advisors --type security` → 0 errores
- INSERT con `role='superadmin'` → falla por CHECK
- INSERT duplicado de `stripe_session_id` → falla por UNIQUE

**Esfuerzo:** 4–6h.

---

## FASE 7 — UI, UX, Accesibilidad

### Hallazgos

| ID | Sev | Descripción |
|----|-----|-------------|
| H-7.1 | 🔴 | 10× `window.confirm()` antipatrón |
| H-7.2 | 🔴 | Footer contraste WCAG fail |
| H-7.3 | 🔴 | Admin mobile nav texto <12px |
| H-7.4 | 🔴 | 9 tablas sin mobile fallback |
| H-7.5+ | 🟠 | `aria-required/invalid`, touch targets <44px, skip link ausente |

### Implementación

1. `src/shared/components/ui/confirm-dialog.tsx` — basado en shadcn `AlertDialog`, API promise-based:
   ```ts
   const confirmed = await confirmDialog({
     title: "¿Eliminar propiedad?",
     description: "Esta acción no se puede deshacer.",
     confirmText: "Eliminar",
     variant: "destructive"
   });
   ```
2. Footer: `text-gray-400` → `text-gray-300`.
3. Admin mobile nav: solo iconos + `aria-label`.
4. `<TableMobile />`: Cards en `<md:`, Table en `≥md:`.
5. Forms: `aria-required`, `aria-invalid`, `aria-describedby`.
6. Skip link en root layout.

**Esfuerzo:** 5–7h.

---

## FASE 8 — SEO y Metadata

### Hallazgos

| ID | Sev | Descripción |
|----|-----|-------------|
| H-8.1 | 🔴 | Homepage sin metadata |
| H-8.2 | 🔴 | Auth pages sin `robots: { index: false }` |
| H-8.3 | 🔴 | Admin pages sin noindex |
| H-8.4 | 🔴 | `/servicios` sin `<h1>` |
| H-8.5+ | 🟠 | Twitter Cards 0%, canonical 0%, og:image 44% |

### Implementación

1. `src/shared/lib/seo/metadata.ts` — función `buildMetadata({ title, description, path, image })` retorna `Metadata` con OG, Twitter, canonical.
2. Homepage `src/app/(main)/page.tsx`: agregar `export const metadata`.
3. `(auth)/layout.tsx` y `admin/layout.tsx`: `metadata.robots = { index: false, follow: false }`.
4. `<h1>` en `/servicios`.
5. `opengraph-image.tsx` dinámico en detail pages.

**Esfuerzo:** 4–6h.

---

## FASE 9 — Testing, Observabilidad, DX

### Hallazgos (la fase más larga, máximo ROI)

| ID | Sev | Descripción |
|----|-----|-------------|
| H-9.1 | 🔴 | Cobertura ~0.05% |
| H-9.2 | 🔴 | Sin Sentry |
| H-9.3 | 🔴 | Sin audit logs DB |
| H-9.4 | 🔴 | Sin Husky/lint-staged |
| H-9.5 | 🔴 | Sin CI/CD |
| H-9.6 | 🔴 | Sin env validation |

### Implementación

1. **Sentry** (`@sentry/nextjs`): DSN en Vercel env.
2. **Audit logs** tabla:
   ```sql
   CREATE TABLE audit_logs (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users,
     action text NOT NULL,
     entity text NOT NULL,
     entity_id text,
     payload jsonb,
     created_at timestamptz DEFAULT now()
   );
   ```
   Helper `logAudit(action, entity, entityId, payload)` aplicado a 10 operaciones críticas.
3. **Husky** + **lint-staged**:
   ```bash
   npm install -D husky lint-staged prettier
   npx husky init
   ```
4. **GitHub Actions** `.github/workflows/ci.yml`: typecheck, lint, test, build, gitleaks.
5. **Env validation** `src/shared/lib/env.ts` con Zod.
6. **Tests críticos**:
   - `requireAdmin`, `requirePropertyAccess` (unit)
   - Webhook Stripe firma inválida → 401 (integration)
   - Signup con `role:'admin'` → role=user (e2e Playwright)
7. **Logger** estructurado (`pino`) reemplaza 32× `console.*`.
8. `/api/health`.

**Esfuerzo:** 14–18h (la más larga, pero infraestructura clave).

---

## FASE 10 — Documentación y Deuda Técnica

### Hallazgos

| ID | Sev | Descripción |
|----|-----|-------------|
| H-10.1 | 🔴 | README genérico template Next.js |
| H-10.2 | 🔴 | 5 contradicciones críticas entre docs |
| H-10.3 | 🔴 | `_legacy/AGENTS.md` duplicado |
| H-10.4 | 🟠 | `package.json` sin metadata |
| H-10.5 | 🟠 | Sin LICENSE / CONTRIBUTING |
| H-10.6 | 🟠 | Schema backup drift |

### Implementación

1. `README.md` profesional: descripción, stack, setup, env vars, comandos, deploy, links.
2. `docs/00_INDEX.md` con estado (ACTUAL / HISTÓRICO).
3. Sync contradicciones:
   - Dominio: `chiclayopropiedades.com` (no `.pe`)
   - #tablas: 13
   - Email: Resend activo + Brevo fallback
   - Stripe: integración pendiente cliente
   - ETAPA 8: completada
4. Borrar `_legacy/AGENTS.md`.
5. `package.json` metadata.
6. LICENSE + CONTRIBUTING.md.
7. Templates `.github/` (PR_TEMPLATE, ISSUE_TEMPLATE).

**Esfuerzo:** 4–5h.

---

## Total restante: ~50–70h

### Orden recomendado de ejecución

```
Sesión 9 (3-4h):   Fase 2 resto + Fase 6 H-6.1/6.5 (DB constraints críticos)
Sesión 10 (6-8h):  Fase 3 resto (split admin-actions + verifyAdmin + transacciones)
Sesión 11 (4-6h):  Fase 4 Performance/ISR
Sesión 12 (6-8h):  Fase 5 Arquitectura (tipos + enums)
Sesión 13-14 (14-18h): Fase 9 Testing + Sentry + audit logs + CI/CD
Sesión 15 (5-7h):  Fase 7 UI/A11y
Sesión 16 (4-6h):  Fase 8 SEO
Sesión 17 (4-5h):  Fase 10 Docs
```

Cada sesión = rama dedicada `fix/fase-N-descripcion` → PR a `main` → CI verde → merge → Vercel auto-deploy.
