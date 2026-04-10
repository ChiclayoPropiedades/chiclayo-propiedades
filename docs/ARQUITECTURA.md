# ARQUITECTURA - Chiclayo Propiedades

## 1. Metodologia de Desarrollo

### Git Flow Simplificado
```
main (produccion)
  └── feature/nombre-del-cambio (desarrollo)
```

- **main**: Branch de produccion. Cada push despliega automaticamente en Vercel.
- **feature/***: Branches para desarrollo de nuevas funcionalidades.
- Se hace merge a main cuando el cambio esta listo y testeado.

### Flujo de trabajo
```
1. git checkout -b feature/nombre-descriptivo
2. Desarrollar y testear localmente
3. npm run build (verificar que compila)
4. npm run typecheck (verificar TypeScript)
5. git add -A && git commit -m "descripcion del cambio"
6. git push origin feature/nombre
7. Merge a main cuando este listo
8. Vercel despliega automaticamente (2-3 min)
9. Verificar en https://chiclayo-propiedades.vercel.app
```

### CI/CD
- **Build**: Vercel ejecuta `next build` en cada push a main
- **Preview**: Vercel genera preview URLs para cada branch/PR
- **Produccion**: Solo main despliega a produccion
- **Rollback**: Vercel permite rollback instantaneo desde el dashboard

---

## 2. Arquitectura del Sistema

### Vista General
```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                 │
│  React 19 + Tailwind CSS 4 + Motion + shadcn/ui     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────────┐
│                   VERCEL (Edge)                      │
│  Next.js 16 App Router                              │
│  ┌─────────────────┐ ┌────────────────────────────┐ │
│  │ Server Components│ │ Server Actions             │ │
│  │ (Lectura/SSR)   │ │ (Mutaciones/CRUD)          │ │
│  └────────┬────────┘ └────────────┬───────────────┘ │
│           │                       │                  │
│  ┌────────▼───────────────────────▼───────────────┐ │
│  │             Middleware (Auth check)             │ │
│  └────────────────────┬───────────────────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────┐
│                   SUPABASE                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │
│  │ Auth     │ │ Database │ │ Storage              │ │
│  │(JWT/SSR) │ │(Postgres)│ │(Imagenes/archivos)   │ │
│  └──────────┘ └──────────┘ └──────────────────────┘ │
│  ┌──────────────────────────────────────────────────┐│
│  │ Row Level Security (RLS)                         ││
│  │ Cada tabla tiene policies de acceso por rol      ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│              SERVICIOS EXTERNOS                      │
│  ┌──────────┐ ┌──────────┐                          │
│  │ Stripe   │ │ Resend   │                          │
│  │(Pagos)   │ │(Emails)  │                          │
│  └──────────┘ └──────────┘                          │
└──────────────────────────────────────────────────────┘
```

### Capas de la Aplicacion

```
┌─────────────────────────────────────────────┐
│           CAPA DE PRESENTACION              │
│  Pages (app/) → Layouts → Components       │
│  Server Components + Client Components      │
│  Motion para animaciones                    │
├─────────────────────────────────────────────┤
│           CAPA DE FEATURES                  │
│  features/*/components/ → UI del dominio   │
│  features/*/services/   → Logica + queries │
│  features/*/types/      → Interfaces TS    │
├─────────────────────────────────────────────┤
│           CAPA COMPARTIDA                   │
│  shared/components/ui/  → shadcn/ui        │
│  shared/lib/            → Supabase, utils  │
│  shared/hooks/          → Custom hooks     │
├─────────────────────────────────────────────┤
│           CAPA DE DATOS                     │
│  Supabase Client (server/client)           │
│  Server Actions ("use server")             │
│  Zod schemas para validacion               │
├─────────────────────────────────────────────┤
│           CAPA DE INFRAESTRUCTURA           │
│  Vercel (hosting + CDN + SSL)              │
│  Supabase (DB + Auth + Storage)            │
│  Stripe (pagos) + Resend (emails)          │
└─────────────────────────────────────────────┘
```

---

## 3. Patrones de Diseno

### Server Components (por defecto)
```tsx
// src/app/(main)/propiedades/page.tsx
// Este componente se ejecuta en el servidor
// Puede hacer queries directas a la DB
export default async function PropertiesPage() {
  const properties = await getProperties()
  return <PropertyGrid properties={properties} />
}
```

### Client Components (solo cuando es necesario)
```tsx
// src/features/properties/components/property-filters.tsx
"use client"
// Necesita "use client" porque usa hooks del browser
// useState, useSearchParams, onClick, etc.
export function PropertyFilters() {
  const [filters, setFilters] = useState({})
  // ...
}
```

### Server Actions (mutaciones)
```tsx
// src/features/contact/services/submit-inquiry.ts
"use server"
// Se ejecuta en el servidor pero se llama desde el cliente
// Valida con Zod, escribe en Supabase
export async function submitInquiry(formData: FormData) {
  const validated = inquirySchema.parse(Object.fromEntries(formData))
  const supabase = await createClient()
  await supabase.from("inquiries").insert(validated)
}
```

### Feature-First Organization
```
Cada feature es un modulo autocontenido:

src/features/properties/
  ├── components/          # UI especifica de propiedades
  │   ├── property-card.tsx
  │   ├── property-grid.tsx
  │   ├── property-form.tsx
  │   └── property-details.tsx
  ├── services/            # Queries y acciones
  │   ├── get-properties.ts    # Lectura (async functions)
  │   └── property-actions.ts  # Escritura (server actions)
  └── types/
      └── index.ts         # Interfaces TypeScript
```

---

## 4. Flujo de Datos

### Lectura (GET)
```
Usuario visita /propiedades
  → Next.js renderiza PropertiesPage (Server Component)
    → getProperties() ejecuta query en Supabase
      → Supabase retorna datos (filtrados por RLS)
        → Next.js renderiza HTML con los datos
          → Browser recibe HTML completo (SEO friendly)
```

### Escritura (POST/PUT/DELETE)
```
Usuario llena formulario de contacto
  → onClick llama Server Action submitInquiry()
    → Zod valida los datos en el servidor
      → Supabase inserta en tabla inquiries (validado por RLS)
        → Server Action retorna resultado
          → UI muestra toast de confirmacion
```

### Autenticacion
```
Usuario hace login
  → Supabase Auth valida email/password
    → Supabase retorna JWT token
      → Middleware de Next.js verifica JWT en cada request
        → Si es valido: acceso permitido
        → Si no: redirect a /login
        → Si role != admin y accede a /admin: redirect a /dashboard
```

---

## 5. Estructura de Carpetas (completa)

```
chiclayo-propiedades/
├── public/                    # Assets estaticos (Vercel los sirve directamente)
│   └── images/               # Logos, iconos
├── src/
│   ├── app/                   # RUTAS - Next.js App Router
│   │   ├── (auth)/           # Grupo: paginas de autenticacion
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── password-recovery/
│   │   │   └── verify-email/
│   │   ├── (main)/           # Grupo: paginas publicas
│   │   │   ├── page.tsx      # Homepage
│   │   │   ├── propiedades/  # Listado + detalle [slug]
│   │   │   ├── blog/         # Listado + detalle [slug]
│   │   │   ├── capacitaciones/
│   │   │   ├── ranking/
│   │   │   ├── servicios/
│   │   │   ├── contacto/
│   │   │   ├── stripe-success/
│   │   │   └── stripe-cancel/
│   │   ├── admin/            # Panel de administracion (9 secciones)
│   │   ├── dashboard/        # Dashboard del agente
│   │   ├── api/              # API routes (auth callback, stripe webhook)
│   │   ├── globals.css       # Estilos globales + CSS variables
│   │   ├── layout.tsx        # Root layout (font, metadata, toaster)
│   │   ├── sitemap.ts        # Sitemap dinamico
│   │   └── robots.ts         # Robots.txt
│   │
│   ├── features/             # LOGICA - Modulos por funcionalidad
│   │   ├── admin/            # CRUD admin, ranking recalc
│   │   ├── auth/             # Formularios de auth
│   │   ├── blog/             # Blog cards, grid, fetch
│   │   ├── contact/          # Formulario contacto, submit
│   │   ├── dashboard/        # Stats, perfil
│   │   ├── properties/       # CRUD propiedades, filtros, cards
│   │   ├── ranking/          # Rankings fetch, tipos
│   │   ├── services/         # Servicios fetch, tipos
│   │   └── trainings/        # Capacitaciones cards, fetch
│   │
│   ├── shared/               # COMPARTIDO - Reutilizable entre features
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui (17 componentes base)
│   │   │   ├── layout/       # Header, Footer, WhatsApp
│   │   │   └── animated/     # Componentes con Motion
│   │   ├── lib/
│   │   │   ├── supabase/     # Clientes server + browser
│   │   │   ├── utils.ts      # cn() para classnames
│   │   │   ├── format.ts     # Formateo de precios, fechas
│   │   │   └── structured-data.ts  # JSON-LD para SEO
│   │   ├── hooks/            # Custom hooks globales
│   │   ├── types/            # Tipos compartidos
│   │   └── constants/        # Constantes globales
│   │
│   └── middleware.ts          # Auth middleware (protege rutas)
│
├── supabase/
│   └── migrations/           # SQL migrations
├── e2e/                       # Tests end-to-end (Playwright)
├── screenshots/               # Capturas de referencia visual
├── _legacy/                   # Archivos deprecados (no eliminar)
│
├── CLAUDE.md                  # Guia de desarrollo
├── ARQUITECTURA.md            # Este documento
├── PLAN_MAESTRO.md            # Fases de desarrollo V2.0
├── STACK_TECNOLOGICO.md       # Stack por fase
├── BUSINESS_LOGIC.md          # Logica de negocio
├── PROYECTO_CONTEXTO.md       # Contexto, credenciales, pendientes
└── package.json               # Dependencias
```

---

## 6. Seguridad

### Autenticacion
- **Supabase Auth** con JWT tokens
- Email/Password (no OAuth por ahora)
- Tokens se refrescan automaticamente via middleware

### Autorizacion (Roles)
| Rol | Acceso |
|-----|--------|
| user | Paginas publicas, perfil |
| agent | Todo de user + dashboard, CRUD propiedades propias |
| admin | Todo + panel admin completo |

### Middleware
```
src/middleware.ts
  → Verifica JWT en cada request
  → Refresca token si esta por expirar
  → No bloquea rutas publicas ni assets
```

### Row Level Security (RLS)
- Cada tabla en Supabase tiene policies
- Un agente solo puede editar SUS propiedades
- Un admin puede editar TODO
- Usuarios anonimos solo pueden LEER datos publicos

### Validacion
- **Server-side** (obligatorio): Zod schemas en Server Actions
- **Client-side** (opcional): Para mejor UX, no como barrera de seguridad
- Nunca confiar en datos del cliente

---

## 7. Testing

### Unit Tests (Jest)
```bash
npm run test          # Correr todos los tests
npm run test:watch    # Watch mode
npm run test:coverage # Con cobertura
```
- Ubicacion: junto al archivo que testean (`__tests__/`)
- Framework: Jest + React Testing Library

### E2E Tests (Playwright)
```bash
npx playwright test   # Correr tests end-to-end
```
- Ubicacion: `e2e/`
- Testean flujos completos (registro, login, crear propiedad, etc.)

### Type Checking
```bash
npm run typecheck     # Verificar TypeScript sin compilar
```

### Linting
```bash
npm run lint          # ESLint
```

---

## 8. Escalabilidad

### Como agregar un nuevo Feature

1. Crear carpeta en `src/features/nuevo-feature/`
2. Agregar subcarpetas: `components/`, `services/`, `types/`
3. Crear pagina en `src/app/(main)/nuevo-feature/page.tsx`
4. Si necesita admin: `src/app/admin/nuevo-feature/page.tsx`
5. Si necesita tabla: crear migration en `supabase/migrations/`

### Como agregar un componente reutilizable

1. Si es UI generico: `src/shared/components/ui/` (estilo shadcn)
2. Si tiene animaciones: `src/shared/components/animated/`
3. Si es layout: `src/shared/components/layout/`
4. Si es especifico de un feature: `src/features/*/components/`

### Performance

- **Server Components** por defecto (menos JS al cliente)
- **Next/Image** para optimizacion automatica de imagenes
- **Lazy loading** con `next/dynamic` para componentes pesados
- **Vercel Edge** para CDN global y cache automatico
- **Motion** solo en componentes que necesitan animacion ("use client" localizado)

---

## 9. Variables de Entorno

### Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=         # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Clave publica de Supabase
NEXT_PUBLIC_APP_URL=              # URL de la app (localhost o vercel)
NEXT_PUBLIC_APP_NAME=             # Nombre de la app
```

### Opcionales (por fase)
```env
# Stripe (Fase 6)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Resend (Fase 7)
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

### Reglas
- Variables con `NEXT_PUBLIC_` son visibles en el cliente
- Variables sin prefijo son solo del servidor
- Nunca commitear `.env.local` (esta en .gitignore)
- Variables de produccion se configuran en Vercel Dashboard
