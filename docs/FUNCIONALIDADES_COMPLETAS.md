# FUNCIONALIDADES COMPLETAS — Chiclayo Propiedades

> Documento de contexto exhaustivo del sistema. Ultima actualizacion: 2026-04-25

---

## 1. Informacion General

| Campo | Valor |
|-------|-------|
| Nombre | Chiclayo Propiedades |
| Tipo | Plataforma inmobiliaria |
| Region | Chiclayo, Lambayeque, Peru |
| URL Produccion | https://chiclayopropiedades.com |
| Dominio | chiclayopropiedades.com (conectado, DNS en Hostinger -> Vercel) |
| Repositorio | github.com/ChiclayoPropiedades/chiclayo-propiedades (privado) |
| Supabase Project | nukwnntnuxlwlmostqqx |
| Deploy | Vercel (auto con git push a main) |

### Stack Tecnologico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI | React + TypeScript | 19.2.4 / 5 |
| Estilos | Tailwind CSS | 4 |
| Componentes | shadcn/ui (base-nova) | latest |
| Animaciones | Motion (Framer Motion) | 12.38+ |
| Graficos | Recharts | 3.8+ |
| Auth | Supabase Auth (Email/Password) | latest |
| Database | Supabase (PostgreSQL) | latest |
| Storage | Supabase Storage (3 buckets) | latest |
| Validacion | Zod | latest |
| Pagos | Stripe + MercadoPago | 22.0 / 2.12 |
| Email | Brevo + Gmail API (dual provider) | latest |
| Deploy | Vercel | auto |

---

## 2. Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Signup, Recovery, Verify
│   ├── (main)/            # Paginas publicas (12 rutas)
│   ├── dashboard/         # Panel agente/usuario (7 rutas)
│   ├── admin/             # Panel administrador (16 rutas)
│   └── api/               # Webhooks y callbacks (4 endpoints)
├── features/              # Modulos por funcionalidad
│   ├── admin/             # Gestion administrativa
│   ├── auth/              # Autenticacion
│   ├── blog/              # Blog inmobiliario
│   ├── contact/           # Formulario de contacto
│   ├── dashboard/         # Panel de usuario
│   ├── properties/        # Propiedades inmobiliarias
│   ├── ranking/           # Ranking de agentes
│   ├── services/          # Servicios ofrecidos
│   ├── subscriptions/     # Suscripciones y planes
│   └── trainings/         # Capacitaciones/cursos
└── shared/                # Codigo reutilizable
    ├── components/ui/     # 29 componentes shadcn/ui
    ├── components/layout/ # Header, Footer, WhatsApp button
    ├── components/animated/ # Hero, ScrollReveal, Counter
    ├── lib/               # Supabase clients, email, stripe, utils
    └── types/             # Tipos compartidos
```

### Patron de Data Fetching
- **Lectura**: Server Components con queries directas a Supabase (RLS aplicado)
- **Mutaciones**: Server Actions (`"use server"`) con validacion Zod
- **Cliente privilegiado**: `supabase/admin.ts` (service_role) para operaciones admin que bypasean RLS

---

## 3. Paginas Publicas (12 rutas)

### 3.1 Home (`/`)
- **Tipo**: Server Component (async)
- **Secciones**: Hero con stats animados (500+ propiedades, 200+ agentes, 1200+ clientes), About, Propiedades destacadas, Ranking agentes, Capacitaciones, Noticias/Blog, Newsletter
- **SEO**: JSON-LD Organization schema
- **Animaciones**: ScrollReveal, AnimatedCounter, Motion

### 3.2 Propiedades — Listado (`/propiedades`)
- **Tipo**: Server Component con Suspense
- **Filtros via URL params**: busqueda texto, tipo operacion (venta/alquiler), tipo propiedad (casa/depto/terreno/oficina/local), rango de precios, distrito
- **Logica**: Excluye propiedades de perfiles ocultos y planes de publicacion expirados
- **UI**: Grid responsive con PropertyCard, estado vacio, skeleton loading

### 3.3 Propiedades — Detalle (`/propiedades/[slug]`)
- **Tipo**: Server Component (async)
- **Contenido**: Galería de imágenes con **lightbox modal clickeable** (todos los thumbnails abren la imagen en grande), datos completos, info del agente, formulario de contacto (genera lead)
- **Galería interactiva** (desde 2026-04-25, commit `8ac27ac`): Componente `PropertyImageGallery` (Client). Click en imagen principal o thumbnail abre Dialog con la foto en grande. Navegación circular con flechas (botones + teclado ←/→). Esc o botón ✕ cierra. Contador "X de N" visible. Funciona para todos los roles (visitante anónimo, comprador, agente, vendedor, super admin).
- **SEO**: JSON-LD Property schema, metadata dinamica
- **404**: Si no existe o no esta activa

### 3.4 Blog — Listado (`/blog`)
- **Tipo**: Server Component (async)
- **Contenido**: Grid de articulos publicados con imagen, titulo, extracto, categoria, fecha
- **Filtro**: Excluye posts de autores inactivos

### 3.5 Blog — Detalle (`/blog/[slug]`)
- **Tipo**: Server Component (force-dynamic)
- **Contenido**: Articulo completo renderizado desde Markdown (react-markdown), breadcrumb, autor, fecha
- **SEO**: JSON-LD Article schema

### 3.6 Capacitaciones — Listado (`/capacitaciones`)
- **Tipo**: Server Component (async)
- **Contenido**: Grid de cursos activos con imagen, titulo, precio, modalidad, fecha

### 3.7 Capacitaciones — Detalle (`/capacitaciones/[slug]`)
- **Tipo**: Server Component (force-dynamic, complejo)
- **Logica condicional por rol**:
  - **Visitante**: CTA para registrarse
  - **Usuario basico**: Boton para solicitar upgrade a agente
  - **Agente con suscripcion**: Boton de inscripcion (Stripe/MercadoPago)
  - **Agente sin suscripcion**: Mensaje de suscripcion requerida
  - **Admin**: Acceso completo
- **Sidebar**: Precio, detalles, boton de inscripcion contextual
- **SEO**: JSON-LD Course schema
- **Metodos de pago para inscripcion**: WhatsApp (manual), Stripe, MercadoPago

### 3.8 Ranking (`/ranking`)
- **Tipo**: Server Component (async) + tabla en Client Component
- **Contenido**: Podio visual (top 3) + tabla completa con paginación
- **Podio (top 3)**: Solo agentes con `sales_count > 0`. Usa función `getRankings()`.
- **Tabla** (desde 2026-04-25, commit `5599562`): Muestra TODOS los agentes activos con suscripción vigente, **incluso los de 0 ventas** (al final). Paginada de 5 en 5 (`<RankingTable />` Client Component). Posición global consistente entre páginas. Usa función `getAllAgentsForRanking()`.
- **Datos**: Avatar, nombre, ventas, monto total, propiedades
- **Filtro**: `role=agent`, `is_active=true`, suscripción `status=active` y `expires_at >= now()`
- **EmptyState** si no hay agentes activos con suscripción.

### 3.9 Servicios (`/servicios`)
- **Tipo**: Server Component (estatico)
- **Secciones**: Servicios para Empresas, Servicios Generales, Servicios para Agentes
- **UI**: Cards con iconos y listas de servicios

### 3.10 Contacto (`/contacto`)
- **Tipo**: Server Component
- **Contenido**: Formulario de contacto (nombre, email, asunto, mensaje) + info de la empresa
- **Accion**: Crea registro en `inquiries` y envia email al agente/admin

### 3.11 Privacidad (`/privacidad`) y Terminos (`/terminos`)
- **Tipo**: Server Components estaticos
- **Contenido**: Politicas legales en prosa con Tailwind typography

### 3.12 Stripe Success/Cancel (`/stripe-success`, `/stripe-cancel`)
- **Tipo**: Server Components
- **Proposito**: Paginas de redireccion post-pago con confirmacion/cancelacion visual

---

## 4. Autenticacion (4 rutas)

### 4.1 Login (`/login`)
- Email + password con toggle de visibilidad
- Redirección por rol: admin → `/admin`, otros → `/dashboard`
- Link a recuperación de contraseña
- **Manejo de errores mejorado** (desde 2026-04-25, commit `5599562`): Mensajes específicos en español para 6 casos: credenciales inválidas, **email no confirmado** (con botón "Reenviar correo de confirmación" via `supabase.auth.resend`), usuario no encontrado, rate limit, error de red, error de DB. Validación adicional tras login: si `profile` es null o `is_active=false`, muestra mensaje claro y NO redirige a dashboard roto (evita pantallas en blanco). Si la cuenta está desactivada, hace `signOut()` automático para evitar estado inconsistente.

### 4.2 Signup (`/signup`)
- Selector de tipo: "Usuario" (comprador/vendedor) o "Agente inmobiliario"
- Validacion: email, password (min 6), confirmacion, telefono (sin duplicados), nombre
- Normalizacion: nombre capitalizado, telefono limpio
- Post-registro: email de bienvenida, redireccion a verificacion

### 4.3 Password Recovery (`/password-recovery`)
- Envia link de recuperacion via Supabase Auth
- Estado de exito post-envio

### 4.4 Verify Email (`/verify-email`)
- Pagina estatica de confirmacion con icono y mensaje

### Middleware de Proteccion
- `/dashboard/*` → redirige a `/login` si no autenticado
- `/admin/*` → redirige a `/login` si no autenticado (luego layout valida rol admin)
- `/login`, `/signup` → redirige a `/dashboard` si ya autenticado

---

## 5. Dashboard — Usuario/Agente (7 rutas)

### 5.1 Dashboard Home (`/dashboard`)
- **Stats**: Propiedades activas, Consultas recibidas, Inscripciones
- **Agentes**: Alerta de estado de suscripcion (activa/expirada/sin suscripcion)

### 5.2 Propiedades (`/dashboard/propiedades`)
- **Vista**: Tabla de propiedades del usuario con estado, acciones (editar/eliminar)
- **Usuarios basicos**: Muestra estado de solicitud de publicacion (pendiente/aprobada/rechazada)
- **Agentes**: Lista de sus propiedades
- **Admin**: Ve todas las propiedades
- **Eliminar propiedad** (Sesión 7, commit `f72c58a`): la action `deleteOwnProperty` (y `deleteProperty` en admin) ahora invalidan TODAS las rutas afectadas por ISR/cache: `/`, `/propiedades`, `/propiedades/[slug]`, `/dashboard/propiedades`, `/admin/propiedades`, `/ranking` (y `/admin/ranking` solo en admin). Se llama también `recalculateRankings()` porque borrar una propiedad activa cambia `properties_count` del agente. Antes la propiedad seguía visible hasta 60s/300s en público

### 5.3 Nueva Propiedad (`/dashboard/propiedades/nueva`)
- **Logica de acceso**:
  - **Admin**: Formulario directo sin restricciones
  - **Agente con suscripcion activa**: Formulario completo
  - **Agente sin suscripcion**: SubscriptionWall (muro de pago)
  - **Usuario con plan aprobado**: Formulario con limite de fotos segun plan
  - **Usuario sin plan**: PublicationPlanWall (seleccion de plan)
- **Formulario**: Titulo, descripcion, precio, moneda, operacion, tipo, habitaciones, banos, area, direccion, distrito, ciudad, coordenadas, imagenes (upload multiple)

### 5.4 Editar Propiedad (`/dashboard/propiedades/[id]/editar`)
- Solo el propietario o admin puede editar
- Formulario pre-llenado con datos existentes

### 5.5 Leads (`/dashboard/leads`)
- **Tipo**: Client Component
- **Contenido**: Lista de consultas recibidas con estado (Nuevo/Contactado/Cerrado)
- **Stats**: Contadores por estado
- **Acciones**: Cambiar estado, contactar por WhatsApp
- **Datos**: Nombre, email, telefono, mensaje, propiedad vinculada

### 5.6 Perfil (`/dashboard/perfil`)
- **Tipo**: Client Component
- **Funciones**: Editar nombre, telefono, bio, avatar (upload JPG/PNG/WebP max 2MB)
- **Avatar**: Upload, preview, eliminacion
- **Evento**: Emite PROFILE_UPDATED_EVENT para actualizar header en tiempo real

### 5.7 Capacitaciones (`/dashboard/capacitaciones`)
- **Agentes**: Lista de inscripciones con estado de pago y link al curso
- **Usuarios**: Mensaje "Exclusivo para Agentes" con boton para solicitar upgrade de rol

---

## 6. Panel Admin (16 rutas)

### 6.1 Dashboard Admin (`/admin`)
- **Notificaciones pendientes** (5 tipos):
  - Solicitudes de upgrade de rol
  - Solicitudes de publicacion
  - Inscripciones pendientes de pago
  - Ventas pendientes de aprobacion
  - Leads nuevos
- **Stats** (4 categorias):
  - Usuarios: total, agentes, basicos
  - Propiedades: activas, vendidas, posts del blog, capacitaciones
  - Leads: nuevos, contactados, cerrados
  - Finanzas: ventas aprobadas, comisiones, ingresos por capacitaciones
- **Graficos** (3):
  - Leads por mes (linea, ultimos 12 meses)
  - Propiedades por tipo (barras)
  - Ventas por periodo (ingresos mensuales)
- **Tabla**: Leads recientes

### 6.2 Usuarios (`/admin/usuarios`)
- Boton "Crear Usuario" con dialog
- Tabla de solicitudes de upgrade de rol pendientes (aprobar/rechazar)
- Tabla de todos los usuarios con acciones de edicion

### 6.3 Detalle de Usuario (`/admin/usuarios/[id]`)
- Header: Avatar, nombre, rol (badge), estado (activo/inactivo), contacto
- Stats rapidos: Propiedades, Leads, Ventas
- Gestion de suscripcion (si es agente): Extender, activar, desactivar
- Solicitudes de publicacion (si es usuario)
- Formulario de edicion (full_name, phone, bio, role + avatar + reset password)
- Tabs: Propiedades y Consultas del usuario
- **Sesión 7 (commit `f72c58a`):**
  - El form llama `router.refresh()` tras cada toast de éxito (datos, avatar subido, avatar eliminado) para reflejar la normalización del nombre y nuevos valores sin F5 manual.
  - `updateUserProfile` valida con Zod schema (full_name min 1 max 100, phone max 20, bio max 1000, role enum estricto `user`/`agent`/`admin`) antes del UPDATE. Bloquea DOM mutation attacks.
  - El cambio de role invalida `/ranking` y `/` además de `/admin/usuarios/*`

### 6.4 Propiedades (`/admin/propiedades`)
- Tabla de solicitudes de publicacion pendientes
- Stats: Total, activas, destacadas
- Tabla de todas las propiedades con DashboardPropertiesView

### 6.5 Editar Propiedad (`/admin/propiedades/[id]/editar`)
- Formulario completo sin restricciones

### 6.6 Leads (`/admin/leads`)
- Mini stats (Nuevos/Contactados/Cerrados)
- Tabla de todos los leads con estado, contacto, propiedad, fecha

### 6.7 Blog (`/admin/blog`)
- Boton "Nuevo Articulo"
- Stats: Publicados, Borradores
- Tabla de todos los posts con acciones

### 6.8 Nuevo Post (`/admin/blog/nuevo`)
- Formulario: Titulo, slug, contenido (Markdown), extracto, imagen de portada, categoria, estado de publicacion

### 6.9 Editar Post (`/admin/blog/[id]/editar`)
- Formulario pre-llenado con datos existentes

### 6.10 Capacitaciones (`/admin/capacitaciones`)
- Boton "Nueva Capacitacion"
- Stats detallados: Total, activas/inactivas, inscripciones totales, por estado de pago
- Tabla de inscripciones con acciones (confirmar/rechazar pago)
- Tabla de capacitaciones con acciones

### 6.11 Nueva Capacitacion (`/admin/capacitaciones/nueva`)
- Formulario: Titulo, slug, descripcion, contenido, precio, moneda, modalidad, ubicacion, instructor, fecha, imagen, estado

### 6.12 Editar Capacitacion (`/admin/capacitaciones/[id]/editar`)
- Formulario pre-llenado

### 6.13 Servicios (`/admin/servicios`)
- Stats: Total, activos, inactivos
- Tabla de servicios con orden de visualizacion

### 6.14 Ranking (`/admin/ranking`)
- Card informativa del algoritmo de ranking
- Tabla de ventas pendientes de aprobacion (aprobar/rechazar)
- Tabla de ranking del periodo actual
- Tabla de rankings de periodos anteriores
- Boton "Recalcular Rankings"

### 6.15 Finanzas (`/admin/finanzas`)
- Stats financieros: Ingresos totales, comisiones, ingresos por capacitaciones, monto total de ventas, ventas aprobadas/pendientes
- Tabla de registros de ventas (propiedad, agente, precio, comision, estado, fecha)
- Tabla de inscripciones a capacitaciones (capacitacion, usuario, monto, estado, fecha)
- Tabla de suscripciones

### 6.16 Configuracion (`/admin/configuracion`)
- **Comisiones**: Porcentaje de comision, tipo de cambio USD/PEN
- **Email**: Proveedor (Brevo/Gmail), credenciales, boton de prueba
- **MercadoPago**: Instrucciones de configuracion, URL de webhook
- **Stripe**: Estado de conexion, instrucciones

---

## 7. API Routes (4 endpoints)

### 7.1 Auth Callback (`GET /api/auth/callback`)
- Intercambia codigo OAuth por sesion de Supabase (`exchangeCodeForSession`)
- **Validación de profile** (Sesión 7, commit `18ff884`):
  - Tras intercambiar el code, lee profile con `createAdminClient()` (service role) para no depender de RLS.
  - Si profile NO existe → llama `ensureProfileExists(user)` (server action idempotente con `INSERT ... ON CONFLICT (user_id) DO NOTHING`). Toma `full_name`, `phone`, `role` de `user.user_metadata`. Red de seguridad por si el trigger `on_auth_user_created` falla.
  - Si profile existe pero `is_active=false` → cierra sesión (`signOut`) y redirige a `/login?error=inactive`.
  - Si todo OK → redirige a `next` (default `/dashboard`).
- Errores reportados al login-form vía query: `?error=auth` (link inválido), `?error=inactive` (cuenta desactivada), `?error=profile` (no se pudo crear perfil)

### 7.2 Sign Out (`POST /api/auth/signout`)
- Cierra sesion de Supabase
- Redirige a `/login`

### 7.3 Stripe Webhook (`POST /api/webhooks/stripe`)
- Verifica firma con STRIPE_WEBHOOK_SECRET
- Evento `checkout.session.completed`:
  - Tipo `agent_subscription`: Crea registro en agent_subscriptions (expira en 1 ano)
  - Tipo `training`: Crea registro en training_enrollments
- Idempotencia por session.id
- Envio de emails de confirmacion

### 7.4 MercadoPago Webhook (`POST /api/webhooks/mercadopago`)
- Verifica firma HMAC-SHA256
- Temas: `payment`, `merchant_order`
- Solo procesa pagos `approved`
- External reference: JSON con tipo, IDs
- Idempotencia por mp_payment_id
- Envio de emails de confirmacion

---

## 8. Sistemas Transversales

### 8.1 Sistema de Email (Dual Provider)
- **Brevo**: API REST (api.brevo.com), HMAC-SHA256
- **Gmail**: OAuth2 con refresh token
- **Seleccion**: Preferencia del admin en platform_settings, auto-detect como fallback
- **Cache**: 1 minuto TTL para settings
- **Templates HTML** (4):
  - `emailWelcome()` — Bienvenida al registrarse
  - `emailLeadNotification()` — Notificacion de nuevo lead al agente
  - `emailTrainingConfirmation()` — Confirmacion de inscripcion a curso
  - `emailSubscriptionConfirmation()` — Confirmacion de suscripcion de agente
- **Envio no bloqueante**: Fallos de email no interrumpen la operacion principal

### 8.2 Sistema de Pagos

#### Stripe
- Checkout Sessions para suscripciones y capacitaciones
- Precios dinamicos o pre-creados (stripe_price_id)
- Webhook con verificacion de firma
- Metadata: tipo, user_id, training_id, profile_id

#### MercadoPago
- Checkout Pro (Preference API)
- External reference con JSON codificado
- Webhook con HMAC-SHA256
- Soporte para suscripciones y capacitaciones

#### Pago Manual (WhatsApp)
- El usuario contacta por WhatsApp para pagar
- Admin confirma manualmente desde el panel

### 8.3 Sistema de Suscripciones (Agentes)
- **Precio**: Configurable en platform_settings (default S/ 99/ano)
- **Duracion**: 1 ano desde activacion
- **Metodos de pago**: Stripe, MercadoPago, WhatsApp (manual), Gratis (si admin habilita)
- **Requerido para**: Publicar propiedades, aparecer en ranking
- **Admin puede**: Activar, extender, desactivar manualmente
- **Estados**: pending, active, expired, cancelled

### 8.4 Sistema de Planes de Publicacion (Usuarios)
- Usuarios basicos solicitan un plan para publicar UNA propiedad
- **Tipos de plan**: Basico (menos fotos), Avanzado (mas fotos)
- **Flujo**: Solicitud → Aprobacion admin → Publicacion con limite de fotos → Plan marcado como usado
- **Expiracion**: Fecha establecida por admin al aprobar
- **Admin puede**: Aprobar, rechazar, cambiar plan, eliminar, desactivar

### 8.5 Sistema de Ranking de Agentes
- **Formula**: Posicion basada en `total_sales_amount` DESC (monto total de ventas aprobadas)
- **Flujo de ventas**:
  1. Agente marca propiedad como vendida (ingresa precio de venta)
  2. `sale_approved = false` (pendiente)
  3. Admin aprueba → `sale_approved = true` + comision calculada
  4. Rankings recalculados automaticamente
- **Comision**: `sale_price * (commission_percentage / 100)`
- **Conversion**: USD a PEN usando tasa en platform_settings
- **Visibilidad**: Solo agentes con suscripcion activa aparecen en ranking publico

### 8.6 Sistema de Upgrade de Rol
- Usuarios pueden solicitar cambio de rol a "agente"
- **Flujo**: Solicitud con motivo → Admin revisa → Aprueba (cambia rol) o Rechaza
- **Estados**: pending, approved, rejected
- **Historial**: El usuario puede ver estado de sus solicitudes

### 8.7 Storage (Supabase)
| Bucket | Acceso | Limite | Uso |
|--------|--------|--------|-----|
| property-images | Publico | 5MB/archivo | Fotos de propiedades |
| blog-images | Publico | 5MB/archivo | Imagenes del blog |
| avatars | Publico | 2MB/archivo | Fotos de perfil |

### 8.8 SEO
- **Sitemap dinamico**: Paginas estaticas + propiedades activas + posts publicados + capacitaciones activas
- **Robots.txt**: Bloquea /dashboard/, /admin/, /api/, auth, pagos
- **JSON-LD**: Organization, Property (RealEstateListing), Article, Course
- **Meta tags**: Titulo, descripcion, OpenGraph por pagina
- **Metadata dinamica**: Generada desde datos de BD para propiedades, posts, capacitaciones

---

## 9. Base de Datos (13 Tablas)

### Tabla de Entidades

| # | Tabla | Registros tipicos | Descripcion |
|---|-------|-------------------|-------------|
| 1 | profiles | Usuarios | Perfiles con role (user/agent/admin), avatar, bio |
| 2 | properties | Propiedades | Listados inmobiliarios con precio, ubicacion, estado |
| 3 | property_images | Fotos | Imagenes asociadas a propiedades con orden y cover |
| 4 | inquiries | Leads | Consultas de compradores con estado de seguimiento |
| 5 | blog_posts | Articulos | Posts del blog en Markdown con categorias |
| 6 | trainings | Cursos | Capacitaciones con precio, modalidad, fecha |
| 7 | training_enrollments | Inscripciones | Registros de pago de cursos |
| 8 | agent_subscriptions | Suscripciones | Suscripciones anuales de agentes |
| 9 | agent_rankings | Rankings | Puntuaciones calculadas por periodo |
| 10 | services | Servicios | Servicios mostrados en la pagina publica |
| 11 | platform_settings | Config | Key-value store de configuracion |
| 12 | publication_requests | Planes | Solicitudes de publicacion de usuarios basicos |
| 13 | role_upgrade_requests | Upgrades | Solicitudes de cambio de rol user→agent |

### Enums y Tipos

```
operation_type:  'venta' | 'alquiler'
property_type:   'casa' | 'departamento' | 'terreno' | 'oficina' | 'local'
property_status: 'active' | 'sold' | 'inactive'
inquiry_status:  'new' | 'contacted' | 'closed'
payment_status:  'pending' | 'paid' | 'completed' | 'failed'
subscription_status: 'pending' | 'active' | 'expired' | 'cancelled'
role_upgrade_status: 'pending' | 'approved' | 'rejected'
user_role:       'user' | 'agent' | 'admin'
currency:        'PEN' | 'USD'
modality:        'presencial' | 'online' | 'virtual'
```

### Seguridad (RLS)
- 43 Row Level Security policies en total (42 originales + `profiles_select_own` agregada en Sesión 7)
- Funcion `is_admin()` para verificar rol admin
- Patron: Lectura publica para contenido activo, escritura restringida por propietario/rol
- Admin client (service_role) para operaciones que bypasean RLS
- **Policies en `public.profiles` (4):**
  - `profiles_select_public` USING (is_active = true) — lectura pública de agentes activos
  - `profiles_select_own` USING (user_id = auth.uid()) — **safety net** para que cada usuario lea su propio perfil aún si is_active=false (necesario para mostrar mensaje "cuenta desactivada" en login)
  - `profiles_update_own` USING (user_id = auth.uid()) — usuario puede editar su propio perfil
  - `profiles_update_admin` USING (is_admin()) — admin puede editar cualquier perfil

### Triggers
- `on_auth_user_created`: Crea automaticamente un perfil cuando un usuario se registra en Supabase Auth

### Indices Especiales
- `idx_properties_sale_pending`: Propiedades vendidas no aprobadas
- `idx_properties_sale_approved`: Ventas aprobadas
- `idx_role_upgrade_requests_pending`: Solicitudes pendientes
- `idx_role_upgrade_requests_profile`: Busqueda por usuario

---

## 10. Componentes UI Reutilizables

### Layout
- **Header**: Navegacion responsive (7 links desktop, sheet mobile), avatar usuario, links por rol
- **Footer**: Info empresa, links rapidos, contacto, horarios, redes sociales, WhatsApp CTA
- **WhatsApp Button**: Boton flotante fijo (bottom-right) con link a wa.me

### Animaciones
- **HeroSection**: Banner full-screen con stats animados y CTAs
- **ScrollReveal**: Wrapper de IntersectionObserver con fade-in desde abajo
- **AnimatedCounter**: Contador numerico animado al hacer scroll

### shadcn/ui (29 componentes)
Avatar, Badge, Button, Card, Dialog, Dropdown, Input, Label, Pagination, Select, Separator, Sheet, Skeleton, Sonner (toast), Table, Tabs, Textarea, y mas.

---

## 11. Variables de Entorno

### Requeridas
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_NAME
```

### Opcionales (por feature)
```
# Stripe
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET

# MercadoPago
MERCADOPAGO_ACCESS_TOKEN
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
MERCADOPAGO_WEBHOOK_SECRET

# Email (Brevo)
BREVO_API_KEY
BREVO_FROM_EMAIL

# Email (Gmail)
GMAIL_CLIENT_ID
GMAIL_CLIENT_SECRET
GMAIL_REFRESH_TOKEN
GMAIL_FROM_EMAIL
```

---

## 12. Datos del Negocio

| Campo | Valor |
|-------|-------|
| Empresa | Chiclayo Propiedades |
| Direccion | Plaza Bolognesi, Av. Francisco Bolognesi 536 Stand 302A, Chiclayo |
| Telefono | +51 928 216 206 |
| Email | info@chiclayopropiedades.com |
| WhatsApp | https://wa.me/51928216206 |
| Monedas | Soles (S/) y Dolares ($) |
| Horario | Lun-Vie 9:00-18:00, Sab 9:00-13:00, Dom cerrado |
| Redes | Facebook, Instagram, YouTube, TikTok |

---

## 13. Resumen de Rutas (39 total)

| Grupo | Cantidad | Rutas |
|-------|----------|-------|
| Publicas | 14 | /, /propiedades, /propiedades/[slug], /blog, /blog/[slug], /capacitaciones, /capacitaciones/[slug], /ranking, /servicios, /contacto, /privacidad, /terminos, /stripe-success, /stripe-cancel |
| Auth | 4 | /login, /signup, /password-recovery, /verify-email |
| Dashboard | 7 | /dashboard, /dashboard/propiedades, /dashboard/propiedades/nueva, /dashboard/propiedades/[id]/editar, /dashboard/leads, /dashboard/perfil, /dashboard/capacitaciones |
| Admin | 16 | /admin, /admin/usuarios, /admin/usuarios/[id], /admin/propiedades, /admin/propiedades/[id]/editar, /admin/leads, /admin/blog, /admin/blog/nuevo, /admin/blog/[id]/editar, /admin/capacitaciones, /admin/capacitaciones/nueva, /admin/capacitaciones/[id]/editar, /admin/servicios, /admin/ranking, /admin/finanzas, /admin/configuracion |
| API | 4 | /api/auth/callback, /api/auth/signout, /api/webhooks/stripe, /api/webhooks/mercadopago |
