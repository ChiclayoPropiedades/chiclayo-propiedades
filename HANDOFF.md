# HANDOFF - Chiclayo Propiedades

> Documento de entrega para continuar el desarrollo de la plataforma.
> Fecha: 2026-04-09

---

## 1. Accesos

### GitHub (codigo fuente)
- **Repo:** https://github.com/ChiclayoPropiedades/chiclayo-propiedades (privado)
- **Cuenta:** ChiclayoPropiedades
- **Email:** propiedadeschiclayo01@gmail.com

### Supabase (base de datos)
- **Dashboard:** https://supabase.com/dashboard/project/nukwnntnuxlwlmostqqx
- **Email:** propiedadeschiclayo01@gmail.com
- **Project ID:** nukwnntnuxlwlmostqqx
- **URL:** https://nukwnntnuxlwlmostqqx.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51a3dubnRudXhsd2xtb3N0cXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjY4MzYsImV4cCI6MjA5MTI0MjgzNn0.OxgQhExyO6gnT9zh7Uob58T_QLypUOMlUIBXoL7FjTI
- **Region:** us-west-2 (Oregon)

### Vercel (hosting)
- **Dashboard:** https://vercel.com/chiclayo-propiedades-projects
- **URL en vivo:** https://chiclayo-propiedades.vercel.app
- **Email:** propiedadeschiclayo01@gmail.com
- **Plan:** Hobby (gratis) - necesita Pro ($20/mes) para uso comercial

### Usuarios de prueba
| Email | Contraseña | Rol |
|-------|-----------|-----|
| test@chiclayopropiedades.com | Test1234! | admin |
| casagrandegrupoinmobiliario@gmail.com | (la de la dueña) | admin |

---

## 2. Como empezar a trabajar

```bash
# 1. Clonar el repo
git clone https://github.com/ChiclayoPropiedades/chiclayo-propiedades.git
cd chiclayo-propiedades

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env.local
cp .env.example .env.local
# Editar .env.local con estas variables:
# NEXT_PUBLIC_SUPABASE_URL=https://nukwnntnuxlwlmostqqx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=(la key de arriba)
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# NEXT_PUBLIC_APP_NAME=Chiclayo Propiedades

# 4. Correr el proyecto
npm run dev

# 5. Abrir http://localhost:3000
```

### Comandos disponibles
```bash
npm run dev          # Servidor desarrollo
npm run build        # Build produccion
npm run start        # Servidor produccion
npm run test         # Tests
npm run typecheck    # Verificar TypeScript
npm run lint         # ESLint
```

---

## 3. Stack tecnologico

| Tecnologia | Version | Para que |
|-----------|---------|----------|
| Next.js | 16.2.2 | Framework web (App Router) |
| React | 19.2.4 | UI |
| TypeScript | 5.x | Tipado |
| Tailwind CSS | 4.x | Estilos |
| shadcn/ui | base-nova | Componentes UI |
| Supabase | - | Auth + Database + Storage |
| Jest | 30.x | Testing |
| Zod | - | Validacion (pendiente de implementar) |

---

## 4. Arquitectura del proyecto

```
src/
├── app/                          # Rutas de Next.js
│   ├── (auth)/                   # Login, signup, recovery, verify-email
│   ├── (main)/                   # Paginas publicas con header+footer
│   ├── dashboard/                # Panel del agente (protegido)
│   ├── admin/                    # Panel admin (protegido, role=admin)
│   └── api/                      # Webhooks y callbacks
├── features/                     # Logica por funcionalidad
│   ├── auth/components/          # Formularios de auth
│   ├── properties/components/    # Cards, grid, filtros, formulario
│   ├── properties/services/      # Server actions CRUD
│   ├── blog/components/          # Cards, grid
│   ├── blog/services/            # Fetch posts
│   ├── trainings/components/     # Cards
│   ├── trainings/services/       # Fetch trainings
│   ├── ranking/services/         # Fetch rankings
│   ├── services/services/        # Fetch services
│   ├── contact/components/       # Formulario contacto
│   ├── contact/services/         # Server action submit
│   ├── dashboard/services/       # Stats, update profile
│   └── admin/                    # Tablas, actions admin
└── shared/                       # Codigo compartido
    ├── components/ui/            # 17 componentes shadcn
    ├── components/layout/        # Header, Footer, WhatsApp
    ├── lib/supabase/             # Client, server, middleware
    ├── lib/utils.ts              # cn() helper
    ├── lib/format.ts             # formatPrice()
    ├── lib/structured-data.ts    # JSON-LD SEO
    └── lib/events.ts             # Eventos entre componentes
```

### Convenciones de imports
```typescript
// shadcn/ui
import { Button } from "@/shared/components/ui/button"

// Utils
import { cn } from "@/shared/lib/utils"
import { formatPrice } from "@/shared/lib/format"

// Supabase
import { createClient } from "@/shared/lib/supabase/server"  // Server
import { createClient } from "@/shared/lib/supabase/client"  // Browser

// Features
import { PropertyCard } from "@/features/properties/components/property-card"
```

---

## 5. Base de datos (Supabase)

### 9 tablas con RLS

| Tabla | Filas | Descripcion |
|-------|-------|-------------|
| profiles | 2+ | Usuarios (user, agent, admin) |
| properties | 11 | Propiedades inmobiliarias |
| property_images | 11 | Fotos de propiedades |
| blog_posts | 0 | Articulos del blog |
| trainings | 3 | Capacitaciones/cursos |
| training_enrollments | 0 | Inscripciones con pago |
| inquiries | 0+ | Consultas/leads |
| agent_rankings | 2 | Ranking de agentes |
| services | 10 | Servicios ofrecidos |

### 3 Storage Buckets
- `property-images` - Fotos de propiedades (publico, max 5MB)
- `blog-images` - Imagenes del blog (publico, max 5MB)
- `avatars` - Fotos de perfil (publico, max 2MB)

### Roles
- `user` - Vendedor/Comprador (se registra eligiendo esta opcion)
- `agent` - Agente Inmobiliario (se registra eligiendo esta opcion)
- `admin` - Administrador (solo se asigna desde el admin panel)

### Trigger importante
Cuando un usuario se registra en auth.users, el trigger `on_auth_user_created` crea automaticamente un registro en `profiles` con full_name, phone y role de los metadata.

---

## 6. Todas las rutas (35 paginas)

### Publicas
| Ruta | Descripcion |
|------|-------------|
| / | Home/Landing con hero, propiedades destacadas, video, capacitaciones |
| /propiedades | Listado con filtros (busqueda, tipo, precio, operacion) |
| /propiedades/[slug] | Detalle con galeria, specs, agente, formulario contacto |
| /servicios | 3 secciones de servicios |
| /ranking | Ranking de asesores con podio top 3 |
| /capacitaciones | Catalogo de cursos con precios |
| /capacitaciones/[slug] | Detalle del curso |
| /blog | Listado de articulos |
| /blog/[slug] | Detalle del articulo |
| /contacto | Formulario + info de contacto |
| /stripe-success | Pago exitoso |
| /stripe-cancel | Pago cancelado |

### Auth
| Ruta | Descripcion |
|------|-------------|
| /login | Email + password |
| /signup | Registro con selector de rol |
| /password-recovery | Envio de enlace por email |
| /verify-email | Pagina de confirmacion |

### Dashboard (agente/usuario)
| Ruta | Descripcion |
|------|-------------|
| /dashboard | Panel con stats |
| /dashboard/propiedades | Mis propiedades (tabla) |
| /dashboard/propiedades/nueva | Crear propiedad |
| /dashboard/propiedades/[id]/editar | Editar propiedad |
| /dashboard/leads | Mis consultas (CRM basico) |
| /dashboard/perfil | Editar perfil + subir foto |
| /dashboard/capacitaciones | Mis cursos comprados |

### Admin
| Ruta | Descripcion |
|------|-------------|
| /admin | Dashboard con 6 stats |
| /admin/usuarios | Gestionar usuarios (roles, activar, eliminar) |
| /admin/propiedades | Gestionar propiedades (editar, destacar, eliminar) |
| /admin/propiedades/[id]/editar | Editar cualquier propiedad |
| /admin/leads | Gestionar consultas (estado, eliminar) |
| /admin/blog | Gestionar articulos (publicar, eliminar) |
| /admin/blog/nuevo | Crear articulo |
| /admin/blog/[id]/editar | Editar articulo |
| /admin/capacitaciones | Gestionar capacitaciones |
| /admin/capacitaciones/nueva | Crear capacitacion |
| /admin/capacitaciones/[id]/editar | Editar capacitacion |
| /admin/servicios | Gestionar servicios (crear, editar, eliminar) |
| /admin/ranking | Recalcular rankings |

### API
| Ruta | Descripcion |
|------|-------------|
| /api/auth/callback | Intercambio code por session |
| /api/webhooks/stripe | Webhook de Stripe (preparado) |

---

## 7. Lo que esta pendiente

### Prioridad Alta
- [ ] **Configurar Site URL en Supabase** - Cambiar de localhost a chiclayo-propiedades.vercel.app en Supabase > Auth > URL Configuration. Sin esto el email de confirmacion redirige a localhost.
- [ ] **Revision visual detallada** - Comparar pagina por pagina con chiclayopropiedades.com y ajustar diseño
- [ ] **Conectar Stripe** - Cliente debe crear cuenta en stripe.com, pasar las keys, conectar el webhook

### Prioridad Media
- [ ] **Configurar Resend** - Emails transaccionales (notificacion de leads, bienvenida, confirmacion pago)
- [ ] **Mapa Leaflet** - Los campos lat/lng existen en la DB pero el mapa no se renderiza en el detalle de propiedad
- [ ] **Email de confirmacion en español** - Actualmente dice "Confirm your signup" en ingles (se cambia en Supabase > Auth > Email Templates)
- [ ] **Migrar imagenes a Supabase Storage** - Actualmente las fotos de propiedades apuntan a chiclayopropiedades.com. Si el cliente baja Hostinger, las fotos dejan de funcionar.

### Prioridad Baja (V2.0)
- [ ] Alertas por email cuando entran propiedades
- [ ] Calculadora de credito hipotecario
- [ ] Comparador de propiedades
- [ ] Tour virtual / galeria 360
- [ ] Notificacion por email al asesor cuando llega lead
- [ ] Estadisticas con graficas
- [ ] Sistema de comisiones
- [ ] Aprobacion de propiedades antes de publicar
- [ ] Reproductor de video en capacitaciones
- [ ] Certificados automaticos
- [ ] Cupones de descuento
- [ ] Testimonios de clientes
- [ ] Casos de exito
- [ ] Reseñas verificadas
- [ ] Reportes ejecutivos

---

## 8. Documentos de referencia en el proyecto

| Archivo | Que contiene |
|---------|-------------|
| CLAUDE.md | Instrucciones para Claude (stack, convenciones, colores, anti-patrones) |
| BUSINESS_LOGIC.md | Logica de negocio (flujos, usuarios, tablas, integraciones) |
| PRP.md | Especificacion tecnica (fases, criterios de exito, aprendizajes) |
| screenshots/ | 9+ capturas del diseno original a replicar |
| .mcp.json | Configuracion de MCPs (Playwright, Supabase, Next DevTools) |
| .env.example | Template de variables de entorno |

---

## 9. Errores conocidos y aprendizajes

### shadcn/ui con feature-first
Los componentes shadcn se generan en `src/components/ui/` pero deben estar en `src/shared/components/ui/`. Despues de instalar un componente nuevo, mover y actualizar imports a `@/shared/components/ui/` y `@/shared/lib/utils`.

### shadcn v4 (base-nova) no soporta asChild
No usar `asChild` en Button, SheetTitle, etc. Usar alternativas como Link directo con clases.

### Supabase joins retornan arrays
Los joins como `agent:profiles(full_name)` retornan arrays, no objetos. Normalizar con:
```typescript
const agent = Array.isArray(data.agent) ? data.agent[0] : data.agent;
```

### Jest 30 setupFiles
La key correcta es `setupFilesAfterEnv` (no `setupFilesAfterSetup` ni `setupAfterEnv`).

### RLS Storage necesita UPDATE policy
Para `upsert` de archivos, necesita policy de UPDATE ademas de INSERT.

---

## 10. Colores y diseño

El diseño replica chiclayopropiedades.com. Screenshots en `/screenshots/`.

| Color | Valor | Uso |
|-------|-------|-----|
| Primario | #2563eb | Botones, links, acentos |
| Primario dark | #1e40af | Hover, headers |
| Secundario | #b8860b | Logo "PROPIEDADES" |
| Texto | #1f2937 | Texto principal |
| Fondo | #ffffff | Fondo general |
| Fondo alt | #eff6ff | Secciones alternadas |
| Bordes | #e5e7eb | Bordes |

---

## 11. Prompt para Claude

Si el programador usa Claude Code, solo necesita abrir el proyecto y Claude lee automaticamente el CLAUDE.md. Si usa Claude web, pegar esto:

```
Soy programador y estoy continuando el desarrollo de una plataforma inmobiliaria.
El proyecto ya esta construido y desplegado.

Codigo: github.com/ChiclayoPropiedades/chiclayo-propiedades
Deploy: chiclayo-propiedades.vercel.app
DB: Supabase proyecto nukwnntnuxlwlmostqqx

Stack: Next.js 16 + React 19 + TypeScript + Tailwind 4 + shadcn/ui + Supabase
Arquitectura: Feature-first (src/features/ + src/shared/ + src/app/)

Los documentos CLAUDE.md, BUSINESS_LOGIC.md y PRP.md tienen toda la especificacion.
El archivo HANDOFF.md tiene los accesos, pendientes y errores conocidos.

[Indicar que se quiere hacer]
```
