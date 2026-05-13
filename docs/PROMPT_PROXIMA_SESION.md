# Prompt para próxima sesión con Claude

> Copia y pega el contenido del bloque que corresponda al inicio de una nueva conversación.

---

## Prompt genérico (recomendado — Claude decide qué fase atacar)

```
Estoy trabajando en Chiclayo Propiedades.
Ruta: C:\KEYBIDIGITAL_DEV\Chilayo Propiedades

Lee en este orden:
1. CLAUDE.md (raíz)
2. docs/SESION_8_HANDOFF.md (qué se hizo + qué falta inmediato)
3. docs/ROADMAP_SEGURIDAD.md (fases 2-10 detalladas)
4. docs/PLAN_MAESTRO.md (roadmap V2.0 del negocio)

Reglas críticas para producción:
- main = producción real (cada push despliega en Vercel)
- Trabaja siempre en rama feature dedicada
- Commits atómicos por hallazgo (uno por commit)
- Verifica typecheck + build + tests tras cada cambio
- NO toques: matcher del middleware, admin-actions.ts (split primero),
  Supabase migrations files (usar Management API/Dashboard)
- Build necesita NODE_OPTIONS="--max-old-space-size=4096"

Estado al cierre de Sesión 8:
- 8 commits en rama fix/seguridad-fase-0-1 (esperando push manual mío)
- 5/9 críticos cerrados: H-0, H-1.3, H-1.4, H-1.5, H-1.7, H-2.2, H-3.1
- Helpers requireUser/requireAdmin/requirePropertyAccess listos en src/shared/lib/auth/

Quiero atacar [INDICA AQUÍ: Fase 2 resto / Fase 3 split admin-actions /
Fase 4 performance / Fase 6 DB constraints / Fase 9 testing+Sentry / etc.]

Antes de codear, propon el plan paso a paso con archivos exactos.
```

---

## Prompts específicos por fase

### Para Fase 2 resto (auth)

```
Continúo Chiclayo Propiedades. Lee CLAUDE.md + docs/SESION_8_HANDOFF.md
+ docs/ROADMAP_SEGURIDAD.md sección "FASE 2 (resto)".

Tareas Fase 2 a cerrar:
- H-2.3 DashboardLayout .single() sin error handler (src/app/dashboard/layout.tsx)
- H-2.4 Login form rama null sin signout
- H-2.5 Zod schemas en signup/login/recovery/update-password forms

H-2.1 server (trigger SQL) lo aplico yo en Supabase Dashboard, no lo toques.

Crea rama fix/fase-2-auth-resto. Un commit por hallazgo. Verifica typecheck +
build + tests después de cada cambio.
```

### Para Fase 3 — split admin-actions.ts + verifyAdmin

```
Continúo Chiclayo Propiedades. Lee CLAUDE.md + docs/SESION_8_HANDOFF.md
+ docs/ROADMAP_SEGURIDAD.md sección "FASE 3 (resto)".

PRIMERO: split src/features/admin/services/admin-actions.ts (1094 líneas)
en 9 archivos por dominio (user-management-actions.ts, property-management,
subscription, payment, blog, training, ranking, inquiry, settings).
Mantén admin-actions.ts como barrel re-export.

DESPUÉS: aplica requireAdmin() del helper src/shared/lib/auth/verify-role.ts
a las 13 funciones admin que mutan datos.

Crea rama fix/fase-3-admin-split. Commits atómicos:
1. refactor: split admin-actions.ts en 9 archivos
2. fix(seguridad): verifyAdmin en N admin actions (H-3.2)
3. fix: markPlanAsUsed no silent failure (H-3.4)
4. fix: deleteUser transaccional con rpc (H-3.5)

Build con NODE_OPTIONS="--max-old-space-size=4096" después de cada paso.
```

### Para Fase 4 — Performance/ISR

```
Continúo Chiclayo Propiedades. Lee CLAUDE.md + docs/ROADMAP_SEGURIDAD.md
sección "FASE 4 — Performance, Cache, ISR".

Tareas:
- H-4.1 Quitar force-dynamic de /capacitaciones/[slug], separar data
  pública (ISR) de autenticada (Suspense + cliente)
- H-4.2 sitemap.ts usar createPublicClient (sin cookies)
- H-4.3 revalidatePath en mutations blog/training
- H-4.4 revalidate en 6 páginas públicas faltantes
- H-4.5 React.cache() para dedup generateMetadata + page

Crea rama fix/fase-4-performance. Un commit por archivo. Verifica que
`next build` muestre ○/● en blog y capacitaciones detail.
```

### Para Fase 6 — DB constraints

```
Continúo Chiclayo Propiedades. Lee CLAUDE.md + docs/ROADMAP_SEGURIDAD.md
sección "FASE 6 — Base de Datos".

Aplicación: vía Supabase MCP (mcp__supabase__apply_migration) si tienes
acceso, o documento SQL para que lo aplique manual en Dashboard.

SQL a aplicar:
- H-6.1 enum + CHECK en profiles.role
- H-6.5 platform_settings is_public column + policies granulares
- H-6.10 currency CHECK
- H-6.13 UNIQUE en stripe_payment_id y mp_payment_id
- H-6.15 índices en properties(status, created_at), inquiries(property_id),
  profiles(email)

Antes de aplicar, ejecuta queries de inspección para no romper datos:
- SELECT DISTINCT role FROM profiles (todos deben caber en enum)
- SELECT DISTINCT currency FROM properties
- SELECT COUNT(*) FROM agent_subscriptions WHERE stripe_session_id IS NULL
  (verificar que no haya rows que violen UNIQUE)
```

### Para Fase 9 — Testing + Sentry + CI/CD

```
Continúo Chiclayo Propiedades. Lee CLAUDE.md + docs/ROADMAP_SEGURIDAD.md
sección "FASE 9".

Esta es la sesión más larga (14-18h). Subfase prioritaria:

SESIÓN 9A (Sentry + env validation + Husky + CI):
- Setup @sentry/nextjs con sentry.{client,server,edge}.config.ts
- src/shared/lib/env.ts con Zod (parsea NEXT_PUBLIC_*, etc.)
- Husky + lint-staged + Prettier
- .github/workflows/ci.yml (typecheck + lint + test + build + gitleaks)

SESIÓN 9B (audit logs + tests críticos):
- Crear tabla audit_logs vía Supabase
- Helper logAudit + aplicar a 10 operaciones admin
- Tests: requireAdmin, requirePropertyAccess, webhook stripe firma inválida
- Reemplazar 32 console.* con logger pino

SESIÓN 9C (Playwright e2e + /api/health):
- Test e2e: signup con role:admin → role=user (verifica H-2.1)
- Test e2e: login + recovery + update-password flow completo
- /api/health endpoint

Crea ramas separadas por subfase.
```

---

## Notas importantes para la nueva conversación

1. **Memoria persiste**: Claude tendrá acceso a las memorias en
   `C:\Users\Keybidigital\.claude\projects\C--KEYBIDIGITAL-DEV-Chilayo-Propiedades\memory\`.
   Si algo cambió (rotaste el PAT, aplicaste el trigger SQL, etc.) díselo
   en el primer mensaje para que actualice memoria.

2. **Plan completo**: El plan maestro consolidado vive en
   `C:\Users\Keybidigital\.claude\plans\splendid-growing-blum.md`.
   Claude puede leerlo si necesita contexto sobre por qué se decidió X.

3. **Estado de rama**: Si ya hiciste push de `fix/seguridad-fase-0-1` y
   mergeaste a main, las nuevas ramas salen de main actualizado. Si no
   mergeaste todavía, la nueva sesión arranca desde main viejo (Claude
   debe avisarte que hay 8 commits sin mergear).

4. **Build memory**: si en alguna sesión el `npm run build` falla por
   memoria, usar `NODE_OPTIONS="--max-old-space-size=8192"` (subir a 8GB).

5. **Supabase MCP**: si MCP de Supabase no autoriza (`Unauthorized`),
   configurar `SUPABASE_ACCESS_TOKEN` en variables de entorno o pasar
   `--access-token` al iniciar el server MCP.
