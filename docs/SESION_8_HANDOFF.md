# Handoff Sesión 8 — Seguridad Fase 0 + 1 + (parcial) 2 + 3

> **Fecha:** 2026-05-12
> **Rama:** `fix/seguridad-fase-0-1`
> **Estado:** 8 commits atómicos listos en local · build/typecheck/tests ✓ · pendiente push manual

---

## 1. Commits entregados

| # | SHA | Hallazgo | Severidad | Archivo(s) |
|---|-----|----------|-----------|------------|
| 1 | `5ef612f` | **H-0** Scrub credenciales filtradas + `.gitignore` endurecido | 🔴 | 4 docs, `.gitignore`, `scripts/scrub_secrets.py` |
| 2 | `0ea6bf0` | **H-1.3** Open redirect en `/api/auth/callback` (validación `next`) | 🔴 | `src/app/api/auth/callback/route.ts` |
| 3 | `8b5650b` | **H-1.4** Headers HTTP (HSTS, X-Frame-Options, CSP report-only) | 🟠 | `next.config.ts` |
| 4 | `8ecd924` | **H-1.7** Fail-loud si falta `SUPABASE_SERVICE_ROLE_KEY` | 🟠 | `src/shared/lib/supabase/admin.ts` |
| 5 | `a3b1860` | **H-1.5** Webhook Stripe fail-closed + reuso de `createAdminClient` | 🟠 | `src/app/api/webhooks/stripe/route.ts` |
| 6 | `3b5fe93` | **H-2.2** Crear `/update-password` (cierra recovery roto) | 🔴 | 2 archivos nuevos en `(auth)` + `features/auth` |
| 7 | `d537bbf` | **H-3 prep** Helpers `requireUser` / `requireAdmin` / `requirePropertyAccess` | 🛠 | `src/shared/lib/auth/verify-role.ts`, `verify-property.ts` |
| 8 | `a7867d7` | **H-3.1** Ownership check en 7 property mutations | 🔴 | `src/features/properties/services/property-actions.ts` |

**Riesgo cerrado en esta sesión:** ~50-60% del total crítico (5 de 9 críticos cerrados).

**Verificación:** `npm run build` ✓ · `npx tsc --noEmit` ✓ · `npm test` 6/6 ✓

---

## 2. Acciones pendientes TUYAS (no automatizables)

### 🔥 Inmediatas (antes de mergear a main)

1. **Push de la rama** — el `.git/config` tiene el PAT viejo revocado, Git falla auth:
   ```bash
   cd "C:/KEYBIDIGITAL_DEV/Chilayo Propiedades"
   git push -u origin fix/seguridad-fase-0-1
   # Cuando pida credenciales: usuario = ChiclayoPropiedades, password = <tu PAT activo>
   ```
   Vercel creará preview deploy automático en `https://chiclayo-propiedades-git-fix-seguridad-fase-0-1-*.vercel.app`.

2. **Verificar preview deploy** antes de mergear:
   ```bash
   # Headers HTTP (debe mostrar HSTS, X-Frame-Options, CSP-Report-Only):
   curl -I https://<preview-url>.vercel.app

   # Open redirect bloqueado:
   curl -L "https://<preview-url>.vercel.app/api/auth/callback?next=//evil.com"
   # → debe redirigir a /dashboard, no a evil.com
   ```

3. **Validar env vars en Vercel** — confirmar que estos están seteados (si falta alguno, ahora falla loud):
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `MERCADOPAGO_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `RESEND_API_KEY`

4. **Merge a `main`** → trigger producción.

### 🔧 Server-side (Supabase Dashboard — fuera de alcance de Claude)

5. **H-2.1 trigger SQL** — la privilege escalation NO está cerrada server-side. El cliente sigue enviando `role` en metadata. Aplicar en SQL Editor del Dashboard:
   ```sql
   -- Inspeccionar el trigger actual primero:
   SELECT prosrc FROM pg_proc WHERE proname = 'handle_new_user';

   -- Si lee raw_user_meta_data->>'role' sin validar admin, reemplazar con:
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (user_id, email, full_name, phone, role)
     VALUES (
       NEW.id,
       NEW.email,
       NEW.raw_user_meta_data->>'full_name',
       NEW.raw_user_meta_data->>'phone',
       CASE
         WHEN NEW.raw_user_meta_data->>'role' = 'agent' THEN 'agent'
         ELSE 'user'  -- NUNCA admin via signup metadata
       END
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

6. **Audit query — verificar si la cadena H-2.1 ya fue explotada**:
   ```sql
   -- Admins creados via signup (sospechoso si hay alguno que no reconoces):
   SELECT
     u.id,
     u.email,
     u.raw_user_meta_data->>'role' AS metadata_role,
     p.role AS profile_role,
     u.created_at
   FROM auth.users u
   LEFT JOIN public.profiles p ON p.user_id = u.id
   WHERE u.raw_user_meta_data->>'role' = 'admin'
      OR p.role = 'admin'
   ORDER BY u.created_at DESC;
   ```

### 🔐 Rotación de credenciales (consolas externas)

7. **GitHub PAT activo** (`github_pat_11CBO7R5...`) → Settings → Developer Settings → Personal access tokens → Revoke + generar nuevo.
8. **Supabase DB password** (`Wr#EpJW2TM.5!?b`) → Dashboard → Settings → Database → Reset password.
9. **Supabase Service Role Key** → Dashboard → Settings → API → Rotate.
10. **Gmail** (`propiedades2324`) → cambiar password Google account + revisar app passwords.
11. **Vercel env vars** → actualizar todos los valores rotados (Settings → Environment Variables).
12. **Actualizar `.git/config`** local con PAT nuevo:
    ```bash
    git remote set-url origin https://<NUEVO-PAT>@github.com/ChiclayoPropiedades/chiclayo-propiedades.git
    ```

### 🧹 Limpieza histórica (opcional, alto impacto)

13. **`git filter-repo`** para purgar PAT viejo del histórico de commits:
    ```bash
    # Backup primero
    git clone --mirror . ../chiclayo-backup-pre-filter.git

    # Filter
    pip install git-filter-repo
    cat > /tmp/secrets.txt <<EOF
    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==><REDACTED>
    Wr#EpJW2TM.5!?b==><REDACTED>
    propiedades2324==><REDACTED>
    EOF
    git filter-repo --replace-text /tmp/secrets.txt --force

    # Force-push coordinado (avisa al equipo antes)
    git push --force --all
    git push --force --tags
    ```
    ⚠️ Esto reescribe el SHA de TODOS los commits → cualquier PR/branch existente queda invalidado.

---

## 3. Pendientes para próximas sesiones (Fases 2-10)

Ver detalle completo en `docs/ROADMAP_SEGURIDAD.md`.

| Fase | Esfuerzo | Hallazgos | Bloqueante |
|------|----------|-----------|------------|
| 2 (resto) | 2–3h | H-2.1 server, H-2.3, H-2.4, H-2.5 Zod | Tras Fase 0+1 mergeada |
| 3 (resto) | 6–8h | H-3.2 verifyAdmin en `admin-actions.ts` (incluye split en 9 archivos), H-3.4 markPlanAsUsed, H-3.5 deleteUser transacción | Tras Fase 2 |
| 4 | 4–6h | Performance/ISR (force-dynamic, sitemap, revalidatePath) | Independiente |
| 5 | 6–8h | Arquitectura: tipos unificados, enums, cross-feature imports | Tras Fase 3 |
| 6 | 4–6h | DB constraints (CHECK enum role, UNIQUE payment IDs, índices) | Tras Fase 2 (trigger) |
| 7 | 5–7h | UI/A11y: ConfirmDialog, mobile tables, contrast, ARIA | Independiente |
| 8 | 4–6h | SEO: metadata homepage, noindex auth/admin, Twitter Cards, canonical | Independiente |
| 9 | 14–18h | Testing + Sentry + audit logs + CI/CD + env validation | Tras Fase 3 |
| 10 | 4–5h | Docs: README profesional, sync contradicciones, LICENSE | Cualquier momento |

**Total restante:** ~50-70h (~2-3 semanas full-time).

---

## 4. Memoria del proyecto (mantener al día)

Memorias relevantes en `C:\Users\Keybidigital\.claude\projects\C--KEYBIDIGITAL-DEV-Chilayo-Propiedades\memory\`:
- `project_production_critical.md` — main = producción real
- `project_security_token_expuesto.md` — actualizar tras rotación
- `feedback_middleware_isr.md` — NO tocar matcher
- `feedback_admin_actions_split.md` — NO agregar más a admin-actions.ts (split en Fase 3)
- `feedback_supabase_no_migrations.md` — schema via Management API/Dashboard
- `feedback_build_memory.md` — usar `NODE_OPTIONS="--max-old-space-size=4096"`

---

## 5. Prompt para iniciar próxima sesión

Ver `docs/PROMPT_PROXIMA_SESION.md` — copy-paste listo para nueva conversación con Claude.
