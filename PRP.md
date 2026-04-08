# PRP-001: Migracion Completa de chiclayopropiedades.com

> **Estado**: APROBADO
> **Fecha**: 2026-04-08
> **Proyecto**: Chiclayo Propiedades

---

## Objetivo

Migrar la plataforma inmobiliaria chiclayopropiedades.com desde Hostinger Horizons (Vite SPA) a Next.js 16 + Supabase, replicando el diseno y funcionalidad actual con mejoras en SEO, rendimiento y escalabilidad.

## Por Que

| Problema | Solucion |
|----------|----------|
| SPA sin SSR, invisible para Google (0 paginas indexadas) | Next.js con SSR y metadata dinamica |
| Hostinger Horizons limita escalabilidad | Supabase + deploy profesional |
| Errores funcionales en la plataforma actual | Codigo limpio, tipado, testeado |
| Sin panel de administracion real | Dashboard agente + Admin panel |

**Valor de negocio**: Visibilidad SEO al 100%, captacion de leads funcional, monetizacion via capacitaciones con Stripe.

## Que

### Criterios de Exito
- [ ] 13 paginas publicas funcionando identicas al original
- [ ] Auth completo (login, signup, recovery, verify-email)
- [ ] CRUD de propiedades para agentes
- [ ] Pagos de capacitaciones con Stripe operativos
- [ ] Blog con editor admin
- [ ] Ranking de asesores funcional
- [ ] Formulario de contacto con notificacion email
- [ ] Dashboard agente + Panel admin
- [ ] SEO: sitemap, metadata, structured data
- [ ] `npm run build` sin errores
- [ ] `npm run test` pasando
- [ ] Lighthouse Performance > 90

### Comportamiento Esperado (Happy Path)

**Visitante:** Llega via Google > Explora propiedades con filtros > Ve detalle con fotos y mapa > Contacta al agente via formulario o WhatsApp.

**Agente:** Se registra como "Agente Inmobiliario" > Verifica email > Publica propiedades desde dashboard > Recibe consultas por email > Aparece en ranking.

**Comprador de curso:** Explora capacitaciones > Hace clic en "Inscribirse" > Paga con Stripe > Accede al contenido.

---

## Contexto

### Referencias
- `screenshots/` - Diseno actual a replicar pixel por pixel
- `BUSINESS_LOGIC.md` - Logica de negocio completa
- `CLAUDE.md` - Convenciones del proyecto

### Arquitectura (Feature-First)

```
src/features/
├── auth/           # Login, signup, recovery, verify
├── properties/     # Listado, detalle, CRUD agente
├── blog/           # Listado, detalle, CRUD admin
├── trainings/      # Catalogo, checkout Stripe, acceso post-pago
├── ranking/        # Ranking de asesores
├── services/       # Pagina de servicios
├── contact/        # Formulario de contacto / leads
├── dashboard/      # Panel del agente
└── admin/          # Panel de administracion
```

### Modelo de Datos

```sql
-- 9 tablas principales
profiles              -- Usuarios (user, agent, admin)
properties            -- Propiedades inmobiliarias
property_images       -- Galeria de imagenes
blog_posts            -- Articulos del blog
trainings             -- Capacitaciones/cursos
training_enrollments  -- Inscripciones con pago Stripe
inquiries             -- Consultas/leads
agent_rankings        -- Ranking de agentes
services              -- Servicios ofrecidos

-- RLS habilitado en todas las tablas
-- Trigger auto-create profile on auth.users insert
-- Trigger auto-update updated_at
```

### Integraciones

| Servicio | Uso | Config |
|----------|-----|--------|
| **Supabase Auth** | Email/Password, roles | Middleware protege /dashboard, /admin |
| **Supabase Storage** | Imagenes propiedades, blog, avatares | 3 buckets publicos |
| **Stripe Checkout** | Pago de capacitaciones | Webhook en /api/webhooks/stripe |
| **Leaflet** | Mapas de ubicacion de propiedades | OpenStreetMap tiles (gratis) |
| **Resend** | Emails transaccionales | Notificacion leads, bienvenida, confirmacion pago |

### Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
```

---

## Blueprint (Assembly Line)

### Fase 0: Fundacion
**Objetivo**: Proyecto base funcionando con estructura completa.
**Validacion**:
- [x] `npm run build` exitoso
- [x] `npm run test` pasando (2 tests)
- [x] Supabase conectado (MCP + SDK)
- [x] Estructura feature-first creada
- [x] CLAUDE.md configurado
- [x] GitHub repo creado y conectado
**Estado**: COMPLETADO

### Fase 1: Autenticacion
**Objetivo**: Sistema completo de auth con Supabase Auth.
**Validacion**:
- [ ] Login con email/password funcional
- [ ] Signup con selector Vendedor/Comprador vs Agente
- [ ] Password recovery via email
- [ ] Email verification funcional
- [ ] Middleware protege /dashboard y /admin
- [ ] Profile se crea automaticamente via trigger SQL

### Fase 2: Propiedades
**Objetivo**: Feature principal - listado publico con filtros y CRUD para agentes.
**Validacion**:
- [ ] /propiedades muestra grid con filtros (tipo, precio, ubicacion)
- [ ] /propiedades/[slug] muestra detalle con galeria y mapa
- [ ] Agente puede crear, editar, eliminar propiedades desde dashboard
- [ ] Upload de imagenes a Supabase Storage
- [ ] Diseno identico al original (ver screenshots)

### Fase 3: Contacto y Leads
**Objetivo**: Captura de leads funcional con notificacion.
**Validacion**:
- [ ] /contacto con formulario funcional
- [ ] Formulario inline en detalle de propiedad
- [ ] Email de notificacion al agente via Resend
- [ ] Admin puede ver y gestionar leads

### Fase 4: Blog
**Objetivo**: Contenido SEO para posicionamiento organico.
**Validacion**:
- [ ] /blog con listado paginado
- [ ] /blog/[slug] con articulo completo y metadata SEO
- [ ] Admin puede crear/editar/eliminar articulos
- [ ] Editor rich text funcional

### Fase 5: Capacitaciones + Stripe
**Objetivo**: Monetizacion via cursos pagados.
**Validacion**:
- [ ] /capacitaciones con catalogo y precios
- [ ] Boton "Inscribirse" redirige a Stripe Checkout
- [ ] Webhook confirma pago y crea enrollment
- [ ] /stripe-success y /stripe-cancel funcionan
- [ ] Contenido visible solo para usuarios que pagaron

### Fase 6: Ranking, Servicios, Dashboard
**Objetivo**: Features secundarias completas.
**Validacion**:
- [ ] /ranking muestra agentes ordenados por score
- [ ] /servicios muestra servicios desde DB
- [ ] /dashboard con resumen del agente
- [ ] /dashboard/perfil permite editar datos y avatar

### Fase 7: Admin Panel
**Objetivo**: Control total de la plataforma.
**Validacion**:
- [ ] /admin con dashboard de stats
- [ ] Gestion de usuarios, propiedades, leads, blog, capacitaciones, servicios, ranking
- [ ] Solo accesible para role=admin

### Fase 8: SEO, Performance, Migracion
**Objetivo**: Optimizacion final y go-live.
**Validacion**:
- [ ] generateMetadata en todas las rutas
- [ ] Sitemap dinamico
- [ ] JSON-LD structured data
- [ ] Lighthouse Performance > 90
- [ ] Datos migrados desde plataforma actual
- [ ] DNS apuntando al nuevo deploy
- [ ] Tests E2E con Playwright pasando

---

## Aprendizajes (Self-Annealing)

### [2026-04-08]: shadcn/ui imports con feature-first
- **Error**: shadcn/ui genera componentes en `src/components/ui/` con imports a `@/lib/utils`, pero la arquitectura feature-first usa `src/shared/`
- **Fix**: Mover componentes a `src/shared/components/ui/`, actualizar `components.json` aliases, y reemplazar imports a `@/shared/lib/utils` y `@/shared/components/ui/`
- **Aplicar en**: Cada vez que se instale un nuevo componente shadcn, verificar que los imports apunten a `@/shared/`

### [2026-04-08]: Jest 30 setupFilesAfterEnv
- **Error**: Jest 30 no reconoce `setupFilesAfterSetup` ni `setupAfterEnv`
- **Fix**: La key correcta es `setupFilesAfterEnv`
- **Aplicar en**: Cualquier proyecto nuevo con Jest 30+

### [2026-04-08]: create-next-app rechaza carpetas con mayusculas
- **Error**: npm naming restrictions no permiten mayusculas en el nombre del proyecto
- **Fix**: Crear en carpeta temporal con nombre kebab-case y mover archivos
- **Aplicar en**: Siempre usar nombres kebab-case para scaffolding

---

## Gotchas

- [ ] Supabase free tier: max 500MB DB, 1GB storage, 50k auth users
- [ ] Stripe Peru: verificar que la cuenta Stripe acepte PEN (soles)
- [ ] Leaflet requiere `next/dynamic` con `ssr: false` (es client-only)
- [ ] Las imagenes de la plataforma actual en Hostinger pueden no ser exportables via API
- [ ] El SEO tarda 2-4 semanas en indexar post-migracion

## Anti-Patrones

- NO crear nuevos patrones si los existentes funcionan
- NO ignorar errores de TypeScript
- NO hardcodear valores (usar constants)
- NO omitir validacion Zod en inputs de usuario
- NO inventar diseno nuevo (replicar screenshots)
- NO usar API routes para CRUD (usar Server Actions)

---

*PRP aprobado. Fase 0 completada. Siguiente: Fase 1 (Autenticacion).*
