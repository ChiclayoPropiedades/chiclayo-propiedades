# STACK TECNOLOGICO POR FASE - Chiclayo Propiedades V2.0

## Arquitectura: Feature-First (obligatorio por SaaS Factory)

> **Por que Feature-First y no Atomic Design?**
> - El proyecto sigue la metodologia SaaS Factory que exige Feature-First
> - Feature-First escala mejor para plataformas con multiples dominios de negocio
> - Cada feature es un modulo independiente: componentes + servicios + tipos + hooks
> - Se puede escalar modulo por modulo sin afectar los demas
> - Mas facil para equipos: cada dev trabaja en su feature sin conflictos

### Estructura interna de cada Feature (estandar)
```
src/features/{feature-name}/
  ├── components/     # Componentes React (client o server)
  ├── services/       # Server Actions + queries a Supabase
  ├── hooks/          # Custom hooks (useFilters, useForm, etc.)
  ├── types/          # Interfaces TypeScript del modulo
  └── utils/          # Helpers especificos del modulo
```

### Componentes compartidos (reutilizables)
```
src/shared/
  ├── components/
  │   ├── ui/         # shadcn/ui (Button, Input, Dialog, etc.) - NO tocar
  │   └── layout/     # Header, Footer, WhatsApp - componentes globales
  ├── lib/            # Supabase clients, utils, format, events
  ├── hooks/          # Hooks globales
  ├── stores/         # Estado global (si se necesita)
  └── types/          # Tipos compartidos entre features
```

---

## STACK BASE (todas las fases)

| Capa | Tecnologia | Version | Funcion | Notas |
|------|-----------|---------|---------|-------|
| Runtime | Node.js | 24+ LTS | Servidor de desarrollo | Requerido |
| Framework | Next.js | 16.2.2 | App Router, SSR, Server Actions | Core del proyecto |
| UI Library | React | 19.2.4 | Componentes, hooks, estado | Core del proyecto |
| Language | TypeScript | 5.x | Tipado estatico, interfaces | Estricto, no usar `any` |
| Estilos | Tailwind CSS | 4.x | Utility-first CSS | No usar CSS Modules |
| Componentes | shadcn/ui | base-nova | Botones, inputs, dialogs, tablas | No tocar internamente |
| Iconos | Lucide React | latest | Iconos SVG optimizados | Consistente en todo el proyecto |
| Validacion | Zod | latest | Esquemas de validacion | Server + client side |
| Notificaciones | Sonner | latest | Toast notifications | Feedback al usuario |
| Fuente | Inter | Google Fonts | Tipografia principal | Definida en layout.tsx |
| Deploy | Vercel | - | CI/CD automatico con git push | Hobby (free) -> Pro ($20/mes) |

---

## FASE 1: FRONTEND PREMIUM

### Stack especifico
| Tecnologia | Version | Funcion | Instalacion |
|-----------|---------|---------|-------------|
| **Motion** | 12.x | Animaciones React (fade-in, slide-up, scroll-reveal, stagger) | `npm install motion` |
| Tailwind CSS | 4.x | Glassmorphism (backdrop-blur, bg-white/10), gradientes, transiciones | Ya instalado |
| Next/Image | Built-in | Imagenes optimizadas (logos, hero background) | Ya incluido |
| CSS @keyframes | Native | Orbs decorativos flotantes, glow effects | En globals.css |

### Patrones usados
- **Server Component** para page.tsx (async data fetching)
- **Client Component** para HeroSection (necesita Motion)
- **next/dynamic** con `ssr: false` si Motion tiene problemas en server
- **CSS Variables** para colores del tema (oklch color space)

### Archivos afectados
```
package.json                              # + motion
public/images/logo-color.png              # NUEVO
public/images/logo-white.png              # NUEVO
public/images/logo-black.png              # NUEVO
src/app/(main)/page.tsx                   # HeroSection rediseñado
src/shared/components/layout/header.tsx   # Logo imagen
src/shared/components/layout/footer.tsx   # Logo blanco imagen
src/app/globals.css                       # Keyframes para animaciones CSS
```

---

## FASE 2: CONFIGURACIONES URGENTES

### Stack especifico
| Tecnologia | Funcion | Donde |
|-----------|---------|-------|
| Supabase Dashboard | Configurar Auth URLs y templates | supabase.com/dashboard |
| HTML | Templates de email en espanol | Supabase > Auth > Email Templates |

### No requiere cambios de codigo
Solo configuracion en el dashboard de Supabase.

---

## FASE 3: LIMPIEZA DE DATOS

### Stack especifico
| Tecnologia | Funcion | Donde |
|-----------|---------|-------|
| Supabase SQL Editor | Queries DELETE para limpiar datos | supabase.com/dashboard |
| Admin Panel | Crear ejemplos via UI existente | /admin/capacitaciones/nueva, /admin/blog/nuevo |

### No requiere cambios de codigo
Operaciones directas en la base de datos y uso del admin panel existente.

---

## FASE 4: RANKING POR VENTAS CERRADAS

### Stack especifico
| Tecnologia | Version | Funcion |
|-----------|---------|---------|
| Supabase Migrations | SQL | ALTER TABLE properties, agent_rankings |
| Server Actions | Next.js 16 | markPropertyAsSold, approveSale, recalculateRankings |
| React | 19 | Nuevos componentes (SaleApproval, SoldBadge) |
| Zod | latest | Validacion de formularios de venta |

### Archivos afectados
```
supabase/migrations/001_add_sale_fields.sql          # NUEVO - ALTER TABLE
src/features/properties/types/index.ts                # Agregar status, sale_price, sale_date
src/features/properties/services/property-actions.ts  # markPropertyAsSold()
src/features/properties/components/sold-badge.tsx     # NUEVO - Badge de "Vendida"
src/features/admin/services/admin-actions.ts          # approveSale(), nuevo recalculateRankings()
src/features/admin/components/sale-approval.tsx       # NUEVO - Tabla de ventas pendientes
src/features/ranking/services/get-rankings.ts         # Query actualizada
src/features/ranking/types/index.ts                   # Agregar sales_count, total_sales_amount
src/app/(main)/ranking/page.tsx                       # Nueva UI de ranking
src/app/(main)/page.tsx                               # RankingSection actualizada
src/app/admin/ranking/page.tsx                        # Tabla de aprobacion de ventas
src/app/dashboard/propiedades/page.tsx                # Boton "Marcar como vendida"
```

### Cambios en DB
```sql
-- Nuevos campos en properties
ALTER TABLE properties
  ADD COLUMN status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
  ADD COLUMN sale_price NUMERIC,
  ADD COLUMN sale_date TIMESTAMPTZ,
  ADD COLUMN sale_approved BOOLEAN DEFAULT false;

-- Nuevos campos en agent_rankings
ALTER TABLE agent_rankings
  ADD COLUMN sales_count INTEGER DEFAULT 0,
  ADD COLUMN total_sales_amount NUMERIC DEFAULT 0;
```

---

## FASE 5: MIGRACION DE IMAGENES

### Stack especifico
| Tecnologia | Funcion |
|-----------|---------|
| Supabase Storage | Bucket property-images |
| Supabase Dashboard | Upload manual o script |
| SQL | UPDATE URLs en property_images |

### Script de migracion
```bash
# Descargar imagenes del sitio original
# Subir al bucket property-images en Supabase
# Actualizar URLs en la tabla property_images
```

---

## FASE 6: STRIPE (Pasarela de Pago)

### Stack especifico
| Tecnologia | Version | Funcion | Instalacion |
|-----------|---------|---------|-------------|
| **Stripe** | latest | Checkout Sessions, Webhooks | `npm install stripe` |
| **@stripe/stripe-js** | latest | Client-side redirect a Checkout | `npm install @stripe/stripe-js` |

### Archivos afectados
```
package.json                                             # + stripe, @stripe/stripe-js
src/shared/lib/stripe.ts                                 # NUEVO - Cliente Stripe
src/features/trainings/services/create-checkout.ts       # NUEVO - Server Action
src/features/trainings/components/enroll-button.tsx       # NUEVO - Boton de inscripcion
src/app/api/webhooks/stripe/route.ts                     # Implementar webhook completo
src/app/(main)/stripe-success/page.tsx                   # Mejorar UI
src/app/(main)/stripe-cancel/page.tsx                    # Mejorar UI
src/app/(main)/capacitaciones/[slug]/page.tsx            # Integrar boton de pago
```

### Variables de entorno necesarias
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## FASE 7: RESEND (Emails Transaccionales)

### Stack especifico
| Tecnologia | Version | Funcion | Instalacion |
|-----------|---------|---------|-------------|
| **Resend** | latest | Envio de emails transaccionales | `npm install resend` |
| **React Email** | latest | Templates de email en React (opcional) | `npm install @react-email/components` |

### Archivos afectados
```
package.json                                          # + resend
src/shared/lib/email.ts                               # NUEVO - Cliente Resend
src/shared/lib/email-templates/                       # NUEVO - Templates de email
  ├── welcome.tsx                                     # Email de bienvenida
  ├── new-inquiry.tsx                                 # Notificacion de lead
  └── payment-confirmation.tsx                        # Confirmacion de pago
src/features/contact/services/submit-inquiry.ts       # Agregar envio de email
```

### Variables de entorno necesarias
```env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=contacto@chiclayopropiedades.com
```

---

## FASE 8: DOMINIO Y PRODUCCION

### Stack especifico
| Tecnologia | Funcion |
|-----------|---------|
| Vercel Pro | Custom domain, analytics, team features |
| DNS (Hostinger) | Registros A y CNAME |
| SSL | Automatico por Vercel |

### Variables de entorno a actualizar
```env
NEXT_PUBLIC_APP_URL=https://chiclayopropiedades.com
NEXT_PUBLIC_SITE_URL=https://chiclayopropiedades.com
# Actualizar Site URL en Supabase tambien
```

---

## FASE 9: MEJORAS V2.0+

### Stack adicional potencial
| Tecnologia | Para que | Fase |
|-----------|----------|------|
| Leaflet + react-leaflet | Mapas interactivos | 9.1 |
| Recharts | Graficas en dashboard analytics | 9.4 |
| Supabase Realtime | Notificaciones en tiempo real | 9.3 |
| Zustand | Estado global para favoritos | 9.6 |

---

## REGLAS DE DESARROLLO (SaaS Factory - OBLIGATORIAS)

1. **NO cambiar el stack** (Golden Path) sin justificacion
2. **NO crear archivos fuera de feature-first** - Todo va en src/features/ o src/shared/
3. **NO usar CSS Modules** - Solo Tailwind CSS
4. **NO crear API routes para CRUD** - Usar Server Actions
5. **NO usar OAuth** - Solo Email/Password
6. **NO usar `any`** en TypeScript
7. **Server Components por defecto** - `"use client"` solo cuando sea necesario
8. **Validar siempre en el servidor** con Zod
9. **Cada libreria nueva debe justificarse** documentando por que se necesita

---

## RESUMEN DE DEPENDENCIAS POR FASE

| Fase | Dependencia nueva | Tamano | Justificacion |
|------|-------------------|--------|---------------|
| 1 | `motion` | ~32KB | Animaciones premium para el homepage (scroll-reveal, fade-in, stagger) |
| 6 | `stripe` + `@stripe/stripe-js` | ~50KB | Pasarela de pagos para capacitaciones |
| 7 | `resend` | ~10KB | Emails transaccionales (leads, bienvenida, pagos) |
| 9.1 | `leaflet` + `react-leaflet` | ~40KB | Mapas interactivos en detalle de propiedad |
| 9.4 | `recharts` | ~100KB | Graficas para dashboard analytics |

**Total peso adicional estimado (Fases 1-8):** ~92KB gzipped
