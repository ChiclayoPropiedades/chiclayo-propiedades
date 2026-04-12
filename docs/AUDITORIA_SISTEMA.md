# AUDITORIA DEL SISTEMA — Chiclayo Propiedades

> Analisis completo de seguridad, rendimiento, arquitectura y estado del sistema.
> Fecha: 2026-04-12 | Version analizada: V1.0 (commit 0e36045)

---

## 1. RESUMEN EJECUTIVO

| Categoria | Estado | Nota |
|-----------|--------|------|
| Seguridad | MEDIO | Credenciales en docs commiteados, RLS solido |
| Rendimiento | BUENO | Server Components, carga optima |
| Arquitectura | BUENO | Feature-first bien implementado |
| Pagos | BUENO | Idempotencia, dual provider, verificacion de firmas |
| Email | BUENO | Dual provider con fallback, cache |
| SEO | BUENO | JSON-LD, sitemap dinamico, meta tags |
| Testing | BAJO | Solo 1 test unitario existente |
| Documentacion | BUENO | Multiples docs, schema backup |

---

## 2. SEGURIDAD

### 2.1 Credenciales Expuestas en Repositorio (CRITICO)

**Hallazgo**: Credenciales sensibles estan commiteadas en archivos .md dentro de `docs/`.

| Credencial | Archivos | Riesgo |
|------------|----------|--------|
| GitHub Personal Access Token (`ghp_...`) | `PROYECTO_CONTEXTO.md`, `SESION_DESARROLLO.md` | CRITICO — Acceso completo al repositorio privado |
| Supabase Anon Key (JWT) | `HANDOFF.md`, `PROYECTO_CONTEXTO.md`, `SESION_DESARROLLO.md` | MEDIO — Es clave publica, pero expone project ID y estructura |
| Supabase Project URL | `HANDOFF.md`, `PROYECTO_CONTEXTO.md`, `SESION_DESARROLLO.md`, `CLAUDE.md` | BAJO — URL es necesaria para el cliente |
| Credenciales de test (email/password) | `PROYECTO_CONTEXTO.md` | MEDIO — Cuentas de prueba con acceso admin/agent |

**Recomendacion**:
1. Revocar inmediatamente el token de GitHub y generar uno nuevo
2. Rotar la Anon Key de Supabase si es posible
3. Mover credenciales a `.env.local` (ya en .gitignore)
4. Considerar un `.gitattributes` o pre-commit hook para detectar tokens
5. Cambiar contraseñas de las cuentas de prueba documentadas

### 2.2 Row Level Security (RLS)

**Estado**: 42 RLS policies implementadas en 13 tablas — **SOLIDO**

| Tabla | Policies | Evaluacion |
|-------|----------|------------|
| profiles | Select publico (activos), update propio, admin full | OK |
| properties | Select publico (activos), CRUD propio (agentes), admin full | OK |
| property_images | Select publico, insert/delete propio | OK |
| inquiries | Insert publico, select propio (agente), admin full | OK |
| blog_posts | Select publico (publicados), admin CRUD | OK |
| trainings | Select publico (activos), admin CRUD | OK |
| training_enrollments | Select/insert propio, admin full | OK |
| agent_subscriptions | Select propio, admin full | OK |
| agent_rankings | Select publico, admin manage | OK |
| services | Select publico (activos), admin CRUD | OK |
| platform_settings | Select publico, admin update | ATENCION — Settings son leibles publicamente |
| publication_requests | Select propio, admin full | OK |
| role_upgrade_requests | Select propio, admin full | OK |

**Observacion sobre platform_settings**: La tabla es leible publicamente. Aunque no contiene secretos directos (las API keys de email estan en env vars), si contiene precios de suscripcion y configuraciones del negocio. Considerar restringir select solo a usuarios autenticados o a settings especificos marcados como publicos.

### 2.3 Middleware de Autenticacion

**Implementacion**: `src/shared/lib/supabase/middleware.ts`

- Protege `/dashboard/*` y `/admin/*` con redireccion a login
- Redirige usuarios autenticados fuera de `/login` y `/signup`
- Refresca sesiones automaticamente via cookies
- **Nota**: La validacion de rol admin se hace en el layout de `/admin`, no en middleware. Esto es correcto para Next.js App Router pero significa que un usuario autenticado no-admin llega a renderizar el layout antes de ser redirigido.

### 2.4 Validacion de Datos

- **Server Actions**: Usan validacion con comprobaciones de autenticacion y rol
- **Zod**: Mencionado en CLAUDE.md como obligatorio pero no se encontro uso extensivo de schemas Zod en las Server Actions revisadas
- **Client-side**: Validacion basica en formularios (required, type, pattern)
- **Uploads**: Validacion de tipo y tamano de archivo antes de subir

**Recomendacion**: Implementar schemas Zod consistentes en TODAS las Server Actions, especialmente en las que reciben datos de formularios.

### 2.5 Webhooks

- **Stripe**: Verificacion de firma con `stripe.webhooks.constructEvent()` — OK
- **MercadoPago**: Verificacion HMAC-SHA256 — OK, pero acepta webhooks sin secret en dev (logs warning)
- **Idempotencia**: Ambos verifican por session_id/payment_id antes de crear registros — OK

### 2.6 Supabase Admin Client

- **Archivo**: `src/shared/lib/supabase/admin.ts`
- **Uso**: Server Actions y webhooks que necesitan bypasear RLS
- **Proteccion**: Throw error si falta SUPABASE_SERVICE_ROLE_KEY
- **Riesgo**: Si se importa accidentalmente en un Client Component, expone service_role key. El archivo no tiene `"use server"` directive.
- **Recomendacion**: Agregar `"use server"` o mover a un modulo que solo sea importable desde server.

---

## 3. RENDIMIENTO

### 3.1 Server Components

**Estado**: EXCELENTE

- La mayoria de paginas son Server Components (async)
- Solo 3 paginas son Client Components: `/dashboard/perfil`, `/dashboard/leads`, y el header
- Data fetching directo a Supabase sin waterfalls innecesarios

### 3.2 Suspense y Loading States

- Suspense boundaries en listados de propiedades con skeleton loading
- Paginas de dashboard con skeleton placeholders mientras cargan datos
- **Mejora sugerida**: Agregar loading.tsx en mas rutas del admin para mejor UX durante navegacion

### 3.3 Imagenes

- **Next.js Image**: Usado para logos y avatares con optimizacion automatica
- **Supabase Storage**: Imagenes servidas directamente (sin CDN intermedio)
- **Remote Patterns**: Configurados en next.config.ts para Supabase, Unsplash, Hostinger
- **Mejora sugerida**: Implementar transformaciones de imagen de Supabase para thumbnails y considerar WebP/AVIF automatico

### 3.4 Caching

- **Email settings**: Cache de 1 minuto para evitar queries repetidos a platform_settings
- **force-dynamic**: Usado en blog/[slug] y capacitaciones/[slug] — siempre fresco
- **Revalidacion**: `revalidatePath()` usado en Server Actions despues de mutaciones
- **Mejora sugerida**: Implementar ISR (Incremental Static Regeneration) para paginas publicas que no cambian frecuentemente (servicios, privacidad, terminos)

### 3.5 Bundle Size

- **Dependencias pesadas**: Recharts (graficos) solo se usa en admin — correcto, no afecta bundle publico
- **Motion**: Usado en paginas publicas — agregar dynamic import con `ssr: false` si no es critico para LCP
- **29 componentes shadcn/ui**: Tree-shaking deberia manejar esto correctamente

---

## 4. ARQUITECTURA

### 4.1 Estructura Feature-First

**Estado**: BIEN IMPLEMENTADO

```
src/features/{feature}/
├── components/     # Componentes React del modulo
├── services/       # Server Actions + queries
└── types/          # Interfaces TypeScript
```

**Fortalezas**:
- Clara separacion de responsabilidades por dominio
- Cada feature es autocontenida
- Imports cruzados minimizados
- Shared components para UI reutilizable

**Areas de mejora**:
- Algunos archivos de servicios son muy grandes (admin-actions.ts: 1094 lineas)
- Considerar dividir admin-actions.ts en archivos mas especificos por entidad

### 4.2 Patrones de Codigo

| Patron | Uso | Evaluacion |
|--------|-----|------------|
| Server Components | Paginas y layouts | Correcto |
| Client Components | Solo donde hay interactividad | Correcto |
| Server Actions | Mutaciones y operaciones de escritura | Correcto |
| Direct Queries | Lectura de datos en Server Components | Correcto |
| RLS + Admin Client | Operaciones privilegiadas | Correcto |
| Event System | Comunicacion cross-component (profile updates) | Creativo, funcional |

### 4.3 Manejo de Errores

- **Server Actions**: Try/catch con mensajes de error descriptivos
- **Paginas**: Manejo de 404 con notFound() para recursos no encontrados
- **Webhooks**: Logging de errores + respuestas HTTP apropiadas
- **Email**: Envio no-bloqueante (fallos no interrumpen operacion principal)
- **Faltante**: No hay error.tsx globales ni por ruta para errores de runtime

### 4.4 TypeScript

- Interfaces definidas por feature en `types/`
- Props tipadas en componentes
- **Mejora**: Algunos valores magicos (strings de estado, roles) podrian ser enums o const objects

---

## 5. SISTEMA DE PAGOS

### 5.1 Stripe

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Checkout Sessions | Implementado | Precios dinamicos y pre-creados |
| Webhook | Implementado | Firma verificada, idempotencia |
| Metadata | Correcto | type, user_id, training_id, profile_id |
| Error handling | Correcto | Try/catch con logging |

### 5.2 MercadoPago

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Checkout Pro | Implementado | Preference API |
| Webhook | Implementado | HMAC-SHA256, acepta sin secret en dev |
| External Reference | Correcto | JSON codificado con tipo e IDs |
| Error handling | Correcto | Try/catch con logging |

### 5.3 Pago Manual (WhatsApp)

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Flujo | Implementado | Usuario contacta por WhatsApp |
| Confirmacion | Manual | Admin confirma desde panel |
| Automatizacion | Ninguna | 100% manual |

### 5.4 Observaciones de Pagos

- **Bueno**: Idempotencia previene duplicados en ambos providers
- **Bueno**: Emails de confirmacion enviados automaticamente
- **Atencion**: MercadoPago acepta webhooks sin verificacion de firma en desarrollo
- **Mejora**: Implementar reintentos de webhook fallidos
- **Mejora**: Agregar logging estructurado para trazabilidad de pagos

---

## 6. SISTEMA DE EMAIL

### 6.1 Arquitectura

```
Platform Settings (DB) → getEmailProvider() → Cache (1min TTL)
                                              ↓
                                    Brevo API / Gmail OAuth2
```

### 6.2 Evaluacion

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Dual provider | Implementado | Brevo + Gmail con auto-detect |
| Cache | Implementado | 1 minuto para settings |
| Templates | 4 templates | Welcome, Lead, Training, Subscription |
| Non-blocking | Implementado | Fallos no interrumpen operaciones |
| Idioma | Espanol | Templates en espanol con marca |
| Test | Implementado | Boton de prueba en admin/configuracion |

### 6.3 Observaciones

- **Bueno**: Patron robusto de dual-provider con fallback
- **Mejora**: Los templates HTML son inline (strings) — considerar archivos .html separados
- **Mejora**: Agregar template para confirmacion de venta aprobada
- **Mejora**: Notificacion al admin cuando hay nuevos leads/solicitudes

---

## 7. SEO

### 7.1 Evaluacion

| Aspecto | Estado | Detalle |
|---------|--------|---------|
| Sitemap | Dinamico | Propiedades, posts, trainings activos |
| Robots.txt | Correcto | Bloquea admin, dashboard, api, auth |
| JSON-LD | 4 schemas | Organization, Property, Article, Course |
| Meta tags | Dinamicos | Titulo, descripcion por pagina |
| OpenGraph | Basico | Configurado en root layout |
| Canonical URLs | No implementado | Faltante |
| Alt text imagenes | Parcial | En property_images, no en todas las imagenes |

### 7.2 Recomendaciones SEO

1. Agregar canonical URLs en todas las paginas
2. Implementar meta tags de Twitter Card
3. Agregar alt text descriptivo a todas las imagenes
4. Considerar paginas de distrito/zona para SEO local
5. Implementar breadcrumbs en mas paginas (solo blog lo tiene)

---

## 8. PROBLEMAS ENCONTRADOS

### 8.1 Bugs Conocidos

| # | Problema | Severidad | Ubicacion |
|---|----------|-----------|-----------|
| 1 | Token GitHub expuesto en docs commiteados | CRITICO | docs/PROYECTO_CONTEXTO.md, SESION_DESARROLLO.md |
| 2 | Credenciales Supabase en docs commiteados | MEDIO | docs/HANDOFF.md, PROYECTO_CONTEXTO.md, SESION_DESARROLLO.md |
| 3 | Cuentas de test con passwords en docs | MEDIO | docs/PROYECTO_CONTEXTO.md |
| 4 | platform_settings leible publicamente via RLS | BAJO | Supabase RLS policy |
| 5 | supabase/admin.ts sin directive "use server" | BAJO | src/shared/lib/supabase/admin.ts |
| 6 | MercadoPago webhook acepta sin firma en dev | BAJO | src/app/api/webhooks/mercadopago/route.ts |

### 8.2 Configuraciones Pendientes

| # | Configuracion | Estado | Impacto |
|---|--------------|--------|---------|
| 1 | Dominio chiclayopropiedades.com | No conectado | SEO, branding |
| 2 | Stripe cuenta del cliente | Pendiente | Pagos con tarjeta |
| 3 | Supabase Site URL | Apunta a localhost | Links en emails de auth |
| 4 | Email custom domain | Pendiente | Deliverability |
| 5 | Google Analytics / Vercel Analytics | No implementado | Sin metricas de uso |

---

## 9. DEUDA TECNICA

### 9.1 Codigo

| # | Item | Prioridad | Detalle |
|---|------|-----------|---------|
| 1 | admin-actions.ts muy grande | MEDIA | 1094 lineas — dividir por entidad |
| 2 | Validacion Zod inconsistente | MEDIA | Algunos Server Actions no validan con Zod |
| 3 | No hay error.tsx boundaries | MEDIA | Errores de runtime sin UI de fallback |
| 4 | Loading states faltantes | BAJA | Varias rutas admin sin loading.tsx |
| 5 | Valores magicos en strings | BAJA | Roles, estados como strings literales |
| 6 | Templates email inline | BAJA | HTML en strings de TypeScript |

### 9.2 Testing

| # | Item | Prioridad | Detalle |
|---|------|-----------|---------|
| 1 | Solo 1 test unitario | ALTA | Solo utils.test.ts (cn function) |
| 2 | Sin tests de integracion | ALTA | Server Actions sin tests |
| 3 | Sin tests E2E | MEDIA | Flujos criticos sin cobertura |
| 4 | Jest configurado pero sin uso | BAJA | Config existe, tests no |

### 9.3 Infraestructura

| # | Item | Prioridad | Detalle |
|---|------|-----------|---------|
| 1 | Sin monitoring/alertas | MEDIA | No hay Sentry, LogRocket, etc. |
| 2 | Sin rate limiting | MEDIA | API endpoints y forms sin proteccion |
| 3 | Sin backup automatizado | MEDIA | Solo backup manual de schema |
| 4 | Sin CI/CD pipeline | BAJA | Solo deploy automatico de Vercel |

---

## 10. RECOMENDACIONES PRIORIZADAS

### CRITICAS (Hacer inmediatamente)

1. **Revocar token de GitHub** expuesto en docs y generar uno nuevo
2. **Cambiar passwords** de las cuentas de prueba documentadas
3. **Agregar `"use server"` a `supabase/admin.ts`** para prevenir importacion en client

### ALTA PRIORIDAD (Proximas 2 semanas)

4. **Conectar dominio** chiclayopropiedades.com a Vercel
5. **Configurar Supabase Site URL** a la URL de produccion
6. **Implementar Zod validation** consistente en todas las Server Actions
7. **Agregar error.tsx** boundaries en rutas principales
8. **Implementar rate limiting** en formularios publicos (contacto, signup, login)
9. **Agregar monitoring** (Sentry o similar) para errores de produccion

### MEDIA PRIORIDAD (Proximo mes)

10. **Dividir admin-actions.ts** en archivos mas pequeños por entidad
11. **Restringir RLS de platform_settings** a configuracion publica
12. **Agregar canonical URLs** a todas las paginas
13. **Implementar tests** para Server Actions criticas (pagos, auth, CRUD)
14. **Agregar loading.tsx** en rutas del admin
15. **Configurar analytics** (Vercel Analytics o Google Analytics)
16. **Implementar ISR** para paginas estaticas (servicios, privacidad, terminos)

### BAJA PRIORIDAD (Mejoras continuas)

17. Extraer email templates a archivos separados
18. Crear enums/const objects para valores magicos (roles, estados)
19. Agregar tests E2E con Playwright para flujos criticos
20. Implementar image optimization con transformaciones de Supabase
21. Agregar breadcrumbs a mas paginas
22. Implementar notificaciones push al admin para nuevos leads
23. Agregar logs estructurados para trazabilidad de pagos

---

## 11. METRICAS DEL PROYECTO

| Metrica | Valor |
|---------|-------|
| Total de rutas | 39 |
| Paginas publicas | 14 |
| Paginas protegidas | 23 |
| API endpoints | 4 |
| Tablas en BD | 13 |
| RLS Policies | 42 |
| Componentes shadcn/ui | 29 |
| Features/modulos | 10 |
| Server Actions | 50+ |
| Templates de email | 4 |
| Providers de pago | 3 (Stripe, MercadoPago, WhatsApp manual) |
| Providers de email | 2 (Brevo, Gmail) |
| Tests | 1 |
| Storage buckets | 3 |

---

## 12. CONCLUSION

El sistema Chiclayo Propiedades es una plataforma inmobiliaria bien construida con una arquitectura feature-first solida, buen uso de Server Components de Next.js 16, y un sistema de pagos robusto con dual-provider. Las principales areas de mejora son:

1. **Seguridad**: Credenciales expuestas en el repositorio (corregir inmediatamente)
2. **Testing**: Cobertura casi nula (priorizar tests de Server Actions criticas)
3. **Monitoring**: Sin observabilidad en produccion (implementar Sentry)
4. **Configuracion**: Dominio y URLs de produccion pendientes de conectar

La arquitectura esta bien fundamentada para escalar. Las recomendaciones se enfocan en hardening de seguridad, estabilidad operacional, y mejoras incrementales que no requieren cambios arquitecturales.
