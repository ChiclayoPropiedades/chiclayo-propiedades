# BUSINESS_LOGIC.md - Chiclayo Propiedades

> Generado por SaaS Factory | Fecha: 2026-04-08
> Migración de: chiclayopropiedades.com (Hostinger Horizons/Vite SPA)
> Destino: Next.js 16 + Supabase + Stripe

## 1. Problema de Negocio

**Dolor:** La plataforma actual está construida en Hostinger Horizons (entorno low-code limitado), no tiene SSR, no indexa en Google, no escala, y presenta errores funcionales que impiden la operación normal del negocio.

**Costo actual:** Pérdida total de visibilidad SEO (0 resultados indexados), limitaciones técnicas que impiden crecer, y una experiencia de usuario deficiente que afecta la captación de leads y ventas.

## 2. Solución

**Propuesta de valor:** Una plataforma inmobiliaria profesional para Chiclayo que conecta compradores, vendedores, arrendatarios y agentes inmobiliarios, con capacitaciones monetizadas y contenido de blog, migrada a un stack moderno y escalable.

**Flujo principal (Happy Path):**

### Flujo Visitante
1. Visitante llega al sitio (SEO/directo)
2. Explora propiedades con filtros (tipo, precio, ubicación, operación)
3. Ve detalle de propiedad (fotos, datos, ubicación, agente)
4. Contacta al agente o envía consulta vía formulario

### Flujo Agente/Usuario Registrado
1. Se registra con email/password
2. Verifica email
3. Publica propiedades desde su panel
4. Aparece en el ranking de agentes
5. Recibe consultas de interesados

### Flujo Capacitaciones (Monetización)
1. Usuario explora catálogo de capacitaciones
2. Selecciona curso/capacitación
3. Paga vía Stripe
4. Accede al contenido post-pago
5. Páginas de confirmación (stripe-success) o cancelación (stripe-cancel)

## 3. Usuario Objetivo

| Rol | Descripción |
|-----|-------------|
| **Visitante** | Persona buscando comprar, alquilar o vender propiedad en Chiclayo |
| **Agente inmobiliario** | Profesional que publica propiedades y busca leads |
| **Administrador** | Gestiona la plataforma, contenido, rankings y capacitaciones |

## 4. Arquitectura de Datos

### Input
- Registro de usuarios (email, password, datos personales)
- Publicación de propiedades (fotos, precio, ubicación, características, tipo de operación)
- Artículos de blog (título, contenido, imágenes, categoría)
- Capacitaciones (título, descripción, precio, contenido)
- Formularios de contacto (nombre, email, mensaje, propiedad relacionada)
- Pagos Stripe (checkout de capacitaciones)

### Output
- Listado de propiedades con filtros y búsqueda
- Fichas detalladas de propiedades
- Ranking de agentes inmobiliarios
- Blog con artículos inmobiliarios
- Catálogo de capacitaciones
- Confirmaciones de pago
- Notificaciones por email (verificación, contacto)

### Storage (Supabase tables)

```
-- Usuarios y autenticación
auth.users                    # Manejado por Supabase Auth

-- Perfiles extendidos
profiles                      # id, user_id, full_name, phone, avatar_url, bio, role, created_at

-- Propiedades
properties                    # id, agent_id, title, description, price, currency, operation_type (venta/alquiler),
                              # property_type (casa/depto/terreno/oficina/local), bedrooms, bathrooms, area_m2,
                              # address, district, city, lat, lng, is_active, featured, created_at, updated_at

property_images               # id, property_id, url, order, is_cover

-- Blog
blog_posts                    # id, author_id, title, slug, content, excerpt, cover_image, category,
                              # is_published, published_at, created_at

-- Capacitaciones
trainings                     # id, title, slug, description, content, cover_image, price, currency,
                              # stripe_price_id, is_active, created_at

training_enrollments          # id, user_id, training_id, stripe_session_id, payment_status, enrolled_at

-- Contacto / Leads
inquiries                     # id, name, email, phone, message, property_id (nullable), status, created_at

-- Ranking
agent_rankings                # id, agent_id, score, properties_count, inquiries_count, period, updated_at

-- Servicios
services                      # id, title, description, icon, order, is_active
```

## 5. KPI de Exito

| Metrica | Objetivo |
|---------|----------|
| **Indexacion SEO** | 100% de paginas publicas indexadas en Google |
| **Tiempo de carga** | < 2 segundos (LCP) |
| **Propiedades activas** | Migrar todas las existentes + capacidad de crecimiento |
| **Conversion contacto** | Formulario funcional con notificaciones |
| **Pagos** | Stripe operativo para capacitaciones |
| **Uptime** | 99.9% en Vercel |

## 6. Especificacion Tecnica

### Estructura de Navegacion (Migración fiel)

```
/                           # Landing / Home
/propiedades                # Listado con filtros
/propiedades/[slug]         # Detalle de propiedad
/servicios                  # Servicios ofrecidos
/ranking                    # Ranking de agentes
/blog                       # Listado de articulos
/blog/[slug]                # Detalle de articulo
/contacto                   # Formulario de contacto
/capacitaciones             # Catalogo de cursos
/capacitaciones/[slug]      # Detalle + checkout
/login                      # Inicio de sesion
/signup                     # Registro
/password-recovery          # Recuperar contrasena
/verify-email               # Verificacion de email
/stripe-success             # Pago exitoso
/stripe-cancel              # Pago cancelado
/dashboard                  # Panel de usuario/agente (nuevo)
/dashboard/propiedades      # Gestionar propiedades
/dashboard/perfil           # Editar perfil
/admin                      # Panel admin (nuevo)
```

### Features a Implementar (Feature-First)

```
src/features/
├── auth/                   # Autenticacion Email/Password (Supabase Auth)
│   ├── login
│   ├── signup
│   ├── password-recovery
│   └── verify-email
├── properties/             # CRUD de propiedades + listado publico + filtros
│   ├── listing             # Listado con filtros (tipo, precio, ubicacion, operacion)
│   ├── detail              # Ficha completa con galeria, mapa, datos
│   └── management          # CRUD para agentes (dashboard)
├── blog/                   # Articulos inmobiliarios
│   ├── listing             # Listado publico
│   ├── detail              # Articulo completo
│   └── management          # CRUD admin
├── trainings/              # Capacitaciones con pago Stripe
│   ├── catalog             # Catalogo publico
│   ├── detail              # Detalle + boton de pago
│   ├── checkout            # Integracion Stripe Checkout
│   └── management          # CRUD admin
├── ranking/                # Ranking de agentes inmobiliarios
├── services/               # Pagina de servicios
├── contact/                # Formulario de contacto / leads
├── dashboard/              # Panel de usuario/agente
└── admin/                  # Panel de administracion
```

### Stack Confirmado

- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind 3.4 + shadcn/ui
- **Backend:** Supabase (Auth + Database + Storage + RLS)
- **Pagos:** Stripe Checkout + Webhooks
- **Validacion:** Zod
- **State:** Zustand (si necesario)
- **Email:** Resend (transaccional)
- **Maps:** Google Maps / Leaflet (ubicacion de propiedades)
- **SEO:** Next.js SSR + metadata API + sitemap dinamico
- **Deploy:** Vercel
- **MCPs:** Playwright + Supabase + Notion

### Proximos Pasos

1. [ ] Generar PRP (Product Requirements Proposal)
2. [ ] Setup proyecto base Next.js 16
3. [ ] Configurar Supabase (schema + RLS + Auth)
4. [ ] Implementar Auth (login, signup, recovery, verify)
5. [ ] Feature: Properties (listado, detalle, CRUD)
6. [ ] Feature: Blog (listado, detalle, admin)
7. [ ] Feature: Trainings + Stripe integration
8. [ ] Feature: Ranking de agentes
9. [ ] Feature: Services page
10. [ ] Feature: Contact / Leads
11. [ ] Feature: Dashboard usuario/agente
12. [ ] Feature: Admin panel
13. [ ] SEO (sitemap, meta tags, structured data)
14. [ ] Testing E2E con Playwright
15. [ ] Deploy Vercel + dominio chiclayopropiedades.com
```

---

*"Migración fiel al modelo existente, con la potencia de un stack profesional."*
