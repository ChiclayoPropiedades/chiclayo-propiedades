# CLAUDE.md - Chiclayo Propiedades

> Plataforma inmobiliaria para Chiclayo, Peru. Migracion de chiclayopropiedades.com (Hostinger Horizons) a Next.js 16 + Supabase.

## Proyecto

- **Nombre:** Chiclayo Propiedades
- **Dominio:** chiclayopropiedades.com
- **Cliente:** propiedadeschiclayo01@gmail.com
- **Repo:** github.com/ChiclayoPropiedades/chiclayo-propiedades
- **Supabase Project ID:** nukwnntnuxlwlmostqqx
- **Supabase URL:** https://nukwnntnuxlwlmostqqx.supabase.co

## Stack (Golden Path - NO cambiar)

```yaml
Runtime: Node.js + TypeScript (strict)
Framework: Next.js 16 (App Router)
Database: PostgreSQL / Supabase
Auth: Supabase Auth (Email/Password)
Styling: Tailwind CSS 4
Components: shadcn/ui (base-nova)
Validation: Zod
State: Zustand (solo si necesario)
Payments: Stripe Checkout
Maps: Leaflet + OpenStreetMap
Email: Resend
Testing: Jest + React Testing Library + Playwright
Deploy: Pendiente (Vercel o Cloudflare Pages)
```

## Arquitectura Feature-First

```
src/
├── app/                    # Next.js App Router (solo rutas, layouts, pages)
│   ├── (auth)/            # Login, signup, recovery, verify-email
│   ├── (main)/            # Paginas publicas
│   ├── dashboard/         # Panel agente (protegido)
│   ├── admin/             # Panel admin (protegido, role=admin)
│   └── api/               # Solo webhooks y callbacks
├── features/              # Logica organizada por funcionalidad
│   ├── auth/              # components/, hooks/, services/, store/, types/
│   ├── properties/
│   ├── blog/
│   ├── trainings/
│   ├── ranking/
│   ├── services/
│   ├── contact/
│   ├── dashboard/
│   └── admin/
└── shared/                # Codigo reutilizable entre features
    ├── components/ui/     # shadcn/ui
    ├── components/layout/ # Header, Footer, MobileNav
    ├── hooks/
    ├── lib/               # supabase.ts, stripe.ts, utils.ts
    ├── stores/
    ├── types/
    ├── utils/
    └── constants/
```

## Convenciones de Codigo

### Imports
- shadcn/ui: `@/shared/components/ui/[component]`
- Utils: `@/shared/lib/utils`
- Feature components: `@/features/[feature]/components/[component]`
- Shared components: `@/shared/components/[component]`
- Types: `@/features/[feature]/types` o `@/shared/types`

### Archivos
- Componentes React: PascalCase (`PropertyCard.tsx` o `property-card.tsx` kebab-case)
- Servicios/utils: camelCase (`getProperties.ts`)
- Types: camelCase (`property.ts`)
- Pages de Next.js: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`

### Componentes
- Server Components por defecto
- Solo usar `"use client"` cuando sea necesario (interactividad, hooks de browser)
- Props tipadas con interfaces, no types
- Usar shadcn/ui para UI, no crear componentes custom si ya existe uno

### Data Fetching
- Server Actions para mutaciones (create, update, delete)
- Server Components con fetch directo para lectura
- Supabase server client en Server Components/Actions
- Supabase browser client solo en Client Components

### Validacion
- Zod schemas en `src/shared/lib/validations/`
- Mismo schema para validacion client y server
- Siempre validar en server, client es opcional (UX)

## Diseno Visual (Replicar del original)

El diseno debe ser IDENTICO al de chiclayopropiedades.com actual. Screenshots de referencia en `/screenshots/`.

### Colores
- **Primario:** Azul `#2563eb` (botones, links, acentos)
- **Primario dark:** Azul oscuro `#1e40af` (hover, headers)
- **Secundario:** Dorado/ocre (logo "PROPIEDADES")
- **Texto:** Gris oscuro `#1f2937`
- **Fondo:** Blanco `#ffffff`
- **Fondo alt:** Azul claro `#eff6ff` (secciones alternadas)
- **Bordes:** Gris claro `#e5e7eb`

### Layout
- Header: Logo izquierda + nav centro + "Iniciar Sesion" / "Registrarse" (azul) derecha
- Footer: 4 columnas (Logo+desc, Enlaces rapidos, Contacto, Newsletter)
- Redes sociales: Facebook, Instagram, YouTube, TikTok
- WhatsApp flotante: Boton verde fijo abajo-derecha

### Tipografia
- Titulos: Bold, grandes, color oscuro
- Subtitulos: Gris medio
- Body: Sans-serif limpio

## Base de Datos

### Tablas principales
- `profiles` - Usuarios extendidos (user, agent, admin)
- `properties` - Propiedades inmobiliarias
- `property_images` - Imagenes de propiedades
- `blog_posts` - Articulos del blog
- `trainings` - Capacitaciones/cursos
- `training_enrollments` - Inscripciones (pagos Stripe)
- `inquiries` - Consultas/leads
- `agent_rankings` - Ranking de agentes
- `services` - Servicios ofrecidos

### Auth
- Email/Password (NO OAuth)
- Roles: user, agent, admin
- Middleware protege /dashboard/* y /admin/*
- Trigger SQL crea profile automaticamente al registrar

### Storage Buckets
- `property-images` - Imagenes de propiedades (publico)
- `blog-images` - Imagenes del blog (publico)
- `avatars` - Fotos de perfil (publico)

## Datos del Negocio

- **Empresa:** Chiclayo Propiedades
- **Direccion:** Av. Luis Gonzales 456, Chiclayo, Lambayeque, Peru
- **Telefono:** +51 928 216 206
- **Email:** info@chiclayopropiedades.com
- **Moneda:** Soles (S/) y Dolares ($)
- **Horario:** Lun-Vie 9AM-6PM, Sab 9AM-1PM, Dom cerrado

## Documentos de Referencia

- `BUSINESS_LOGIC.md` - Logica de negocio completa
- `PRP.md` - Especificacion tecnica (schema SQL, RLS, Server Actions, componentes)
- `screenshots/` - Capturas del diseno actual a replicar

## Anti-Patrones (NO hacer)

- NO usar CSS Modules, solo Tailwind
- NO crear API routes para CRUD (usar Server Actions)
- NO usar OAuth (solo Email/Password)
- NO inventar disenos nuevos (replicar el actual)
- NO usar `any` en TypeScript
- NO hardcodear valores (usar constants)
- NO ignorar errores de TypeScript o ESLint
- NO crear archivos fuera de la estructura feature-first
- NO instalar librerias sin justificacion (preguntar primero)
