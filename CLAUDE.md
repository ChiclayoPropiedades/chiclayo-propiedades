# CLAUDE.md - Chiclayo Propiedades

> Plataforma inmobiliaria para Chiclayo, Peru. Next.js 16 + Supabase + Vercel.

## Proyecto

- **Nombre:** Chiclayo Propiedades
- **Dominio:** chiclayopropiedades.com (pendiente conectar)
- **Produccion:** https://chiclayo-propiedades.vercel.app
- **Repo:** github.com/ChiclayoPropiedades/chiclayo-propiedades (privado)
- **Supabase Project ID:** nukwnntnuxlwlmostqqx
- **Supabase URL:** https://nukwnntnuxlwlmostqqx.supabase.co

## Stack

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI | React + TypeScript | 19 / 5 |
| Estilos | Tailwind CSS | 4 |
| Componentes | shadcn/ui (base-nova) | latest |
| Animaciones | Motion (Framer Motion) | latest |
| Auth | Supabase Auth (Email/Password) | latest |
| Database | Supabase (PostgreSQL) | latest |
| Storage | Supabase Storage | latest |
| Validacion | Zod | latest |
| Pagos | Stripe Checkout | pendiente |
| Email | Resend | pendiente |
| Testing | Jest + Playwright | latest |
| Deploy | Vercel | auto con git push |

## Arquitectura Feature-First

```
src/
├── app/                    # Next.js App Router (rutas, layouts, pages)
│   ├── (auth)/            # Login, signup, recovery, verify-email
│   ├── (main)/            # Paginas publicas (home, propiedades, blog, etc.)
│   ├── dashboard/         # Panel del agente (protegido por auth)
│   ├── admin/             # Panel admin (protegido por role=admin)
│   └── api/               # Webhooks y callbacks
├── features/              # Modulos organizados por funcionalidad
│   ├── admin/             # components/ services/ types/
│   ├── auth/              # components/ services/ types/
│   ├── blog/              # components/ services/ types/
│   ├── contact/           # components/ services/ types/
│   ├── dashboard/         # components/ services/ types/
│   ├── properties/        # components/ services/ types/
│   ├── ranking/           # components/ services/ types/
│   ├── services/          # components/ services/ types/
│   └── trainings/         # components/ services/ types/
└── shared/                # Codigo reutilizable entre features
    ├── components/
    │   ├── ui/            # shadcn/ui (Button, Input, Dialog, etc.)
    │   ├── layout/        # Header, Footer, WhatsApp
    │   └── animated/      # Componentes con Motion (HeroSection, etc.)
    ├── hooks/             # Custom hooks globales
    ├── lib/               # Supabase clients, utils, format, stripe
    ├── types/             # Tipos compartidos
    └── constants/         # Constantes globales
```

## Convenciones de Codigo

### Componentes
- Server Components por defecto
- `"use client"` solo cuando es necesario (interactividad, Motion, hooks de browser)
- Props tipadas con interfaces
- shadcn/ui para UI base, componentes custom cuando se necesite algo distinto

### Data Fetching
- **Lectura:** Server Components con queries directas a Supabase
- **Mutaciones:** Server Actions (`"use server"`)
- **Supabase server client** en Server Components y Server Actions
- **Supabase browser client** solo en Client Components

### Imports
```typescript
// shadcn/ui
import { Button } from "@/shared/components/ui/button"
// Shared
import { cn } from "@/shared/lib/utils"
// Features
import { PropertyCard } from "@/features/properties/components/property-card"
// Types
import type { Property } from "@/features/properties/types"
```

### Validacion
- Zod schemas para validacion server-side (obligatorio)
- Validacion client-side opcional para mejor UX

### Estilos
- Solo Tailwind CSS (no CSS Modules, no styled-components)
- Colores del tema via CSS variables
- Responsive con breakpoints de Tailwind (sm, md, lg, xl)

## Colores del Tema

| Color | Hex | Uso |
|-------|-----|-----|
| Primario | #2563eb | Botones, links, acentos |
| Primario dark | #1e40af | Hover, headers |
| Dorado | #b8860b | Logo "PROPIEDADES", acentos premium |
| Texto | #1f2937 | Texto principal |
| Fondo | #ffffff | Fondo principal |
| Fondo alt | #eff6ff | Secciones alternadas |
| Bordes | #e5e7eb | Bordes y separadores |

## Base de Datos

### Tablas
| Tabla | Descripcion |
|-------|-------------|
| profiles | Usuarios (user, agent, admin) |
| properties | Propiedades inmobiliarias |
| property_images | Fotos de propiedades |
| inquiries | Leads/consultas de compradores |
| blog_posts | Articulos del blog |
| trainings | Capacitaciones/cursos |
| training_enrollments | Inscripciones a cursos |
| services | Servicios ofrecidos |
| agent_rankings | Ranking de agentes |

### Auth
- Email/Password (no OAuth)
- Roles: user, agent, admin
- Middleware protege /dashboard/* y /admin/*
- Trigger SQL crea profile al registrar

### Storage Buckets
- `property-images` - Fotos de propiedades (publico)
- `blog-images` - Imagenes del blog (publico)
- `avatars` - Fotos de perfil (publico)

## Datos del Negocio

- **Empresa:** Chiclayo Propiedades
- **Direccion:** Plaza Bolognesi, Av. Francisco Bolognesi 536 Stand 302A, Chiclayo, Lambayeque, Peru
- **Telefono:** +51 928 216 206
- **Email:** info@chiclayopropiedades.com
- **Moneda:** Soles (S/) y Dolares ($)
- **WhatsApp:** https://wa.me/51928216206

## Deploy

```bash
git push  # Vercel despliega automaticamente en 2-3 min
```

Verificar siempre antes de push:
```bash
npm run build     # Sin errores
npm run typecheck # Sin errores TypeScript
```

## Documentos de Referencia

| Documento | Contenido |
|-----------|-----------|
| ARQUITECTURA.md | Metodologia, patrones, flujos, seguridad |
| PLAN_MAESTRO.md | Fases de desarrollo V2.0 |
| STACK_TECNOLOGICO.md | Stack detallado por fase |
| BUSINESS_LOGIC.md | Logica de negocio del cliente |
| PROYECTO_CONTEXTO.md | Contexto completo, credenciales, pendientes |
| HANDOFF.md | Documento de entrega V1.0 |
| PRP.md | Especificacion tecnica V1.0 |
