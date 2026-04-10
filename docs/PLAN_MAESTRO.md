# PLAN MAESTRO - Chiclayo Propiedades V2.0
## Plataforma Inmobiliaria | Chiclayo, Peru

**Fecha:** 2026-04-10
**Estado actual:** V1.0 desplegada en Vercel (8 fases completadas, 35 paginas, 9 tablas)
**Objetivo:** Llevar la plataforma de V1.0 funcional a V2.0 profesional y lista para produccion real

---

## ESTADO ACTUAL DEL PROYECTO

### Lo que YA existe y funciona:
- 32 paginas (9 publicas, 4 auth, 8 dashboard, 11 admin)
- 9 tablas en Supabase (profiles, properties, property_images, inquiries, blog_posts, trainings, training_enrollments, services, agent_rankings)
- Auth completo (login, signup, recovery, verify email)
- CRUD completo en admin (usuarios, propiedades, leads, blog, capacitaciones, servicios, ranking)
- Dashboard de agente (propiedades, leads, perfil)
- SEO (sitemap, robots, metadata, JSON-LD)
- Deploy automatico en Vercel

### Lo que FALTA o necesita mejoras:
- Frontend del homepage no es premium
- Ranking basado en actividad (debe ser por ventas cerradas)
- Stripe no conectado (webhook vacio)
- Emails en ingles, Site URL apunta a localhost
- Imagenes apuntan a Hostinger
- No hay datos de ejemplo utiles
- Resend no configurado
- Dominio no conectado

---

## FASES DE IMPLEMENTACION

---

### FASE 1: FRONTEND PREMIUM (Homepage + Logos + Efectos)
**Prioridad:** ALTA | **Duracion estimada:** 1 sesion
**Impacto:** Visual - primera impresion del cliente

#### Front:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 1.1 | Instalar Motion | package.json | `npm install motion` (~32KB) |
| 1.2 | Copiar logos a /public/images/ | public/images/ | logo-color.png, logo-white.png, logo-black.png |
| 1.3 | Redisenar HeroSection premium | src/app/(main)/page.tsx | Logo grande centrado, glassmorphism, animaciones de entrada (fade-in, slide-up, stagger), orbs decorativos, gradientes animados, stats con glass-morphism |
| 1.4 | Logo real en Header | src/shared/components/layout/header.tsx | Reemplazar texto por Image del logo |
| 1.5 | Logo real en Footer | src/shared/components/layout/footer.tsx | Reemplazar texto por Image del logo blanco |
| 1.6 | Mejorar secciones del homepage | src/app/(main)/page.tsx | Scroll-reveal con Motion en About, Properties, Ranking, Trainings, News, Newsletter |

#### Backend: Ninguno
#### DB: Ninguno

---

### FASE 2: CONFIGURACIONES URGENTES (Supabase + Emails)
**Prioridad:** CRITICA | **Duracion estimada:** 30 min
**Impacto:** Funcional - sin esto el registro no funciona correctamente

#### Front: Ninguno

#### Backend/Config:
| # | Tarea | Donde | Detalle |
|---|-------|-------|---------|
| 2.1 | Configurar Site URL | Supabase Dashboard | Cambiar localhost:3000 por chiclayo-propiedades.vercel.app |
| 2.2 | Agregar Redirect URLs | Supabase Dashboard | chiclayo-propiedades.vercel.app/** y localhost:3000/** |
| 2.3 | Emails en espanol | Supabase > Auth > Templates | Confirm signup y Reset password en espanol |

#### DB: Ninguno

---

### FASE 3: LIMPIEZA DE DATOS (Propiedades + Ejemplos)
**Prioridad:** ALTA | **Duracion estimada:** 1 sesion
**Impacto:** Contenido - el cliente quiere empezar limpio

#### Front: Ninguno

#### Backend:
| # | Tarea | Archivo/Donde | Detalle |
|---|-------|---------------|---------|
| 3.1 | Borrar propiedades de ejemplo | Supabase DB | DELETE de properties y property_images de prueba |
| 3.2 | Crear 1 capacitacion ejemplo | Supabase DB / Admin panel | Capacitacion borrable con todos los campos (nombre, descripcion, precio, modalidad, ubicacion, fecha, instructor, contenido) |
| 3.3 | Crear 1 articulo blog ejemplo | Supabase DB / Admin panel | Articulo editable/borrable de ejemplo |
| 3.4 | Verificar servicios | Supabase DB | Asegurar que los servicios tienen datos correctos |

#### DB:
| # | Tarea | Tabla | Detalle |
|---|-------|-------|---------|
| 3.5 | Limpiar property_images | property_images | Borrar imagenes huerfanas |
| 3.6 | Verificar integridad | Todas | FK constraints, datos huerfanos |

---

### FASE 4: RANKING POR VENTAS CERRADAS
**Prioridad:** ALTA | **Duracion estimada:** 1 sesion
**Impacto:** Logica de negocio - cambio fundamental solicitado por el cliente

#### Front:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 4.1 | Actualizar pagina de ranking | src/app/(main)/ranking/page.tsx | Mostrar: ventas cerradas, monto total vendido, propiedades publicadas. Posicion = monto de venta |
| 4.2 | Actualizar ranking en homepage | src/app/(main)/page.tsx | RankingSection con nueva data |
| 4.3 | Boton "Marcar como vendida" | src/features/properties/components/ | En dashboard del agente y admin, boton para marcar propiedad como vendida |
| 4.4 | Flujo de aprobacion | src/features/admin/components/ | Admin aprueba la venta antes de que sume puntos |

#### Backend:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 4.5 | Nueva accion: markPropertyAsSold | src/features/properties/services/ | Server action para marcar propiedad como vendida (con precio de venta) |
| 4.6 | Nueva accion: approveSale | src/features/admin/services/ | Server action para que admin apruebe la venta |
| 4.7 | Actualizar recalculateRankings | src/features/admin/services/admin-actions.ts | Nuevo algoritmo: score = monto_total_vendido. Considerar conversion PEN/USD |
| 4.8 | Obtener ventas por agente | src/features/ranking/services/ | Query para ventas cerradas + montos por agente |

#### DB:
| # | Tarea | Tabla | Detalle |
|---|-------|-------|---------|
| 4.9 | Agregar campo `status` a properties | properties | Enum: 'active', 'sold', 'inactive'. Default 'active' |
| 4.10 | Agregar campo `sale_price` a properties | properties | Precio real de venta (puede diferir del precio publicado) |
| 4.11 | Agregar campo `sale_date` a properties | properties | Fecha de cierre de venta |
| 4.12 | Agregar campo `sale_approved` a properties | properties | Boolean, admin aprueba la venta |
| 4.13 | Actualizar agent_rankings | agent_rankings | Agregar: sales_count, total_sales_amount, properties_count |
| 4.14 | Crear migration SQL | supabase/migrations/ | ALTER TABLE con nuevos campos |

---

### FASE 5: MIGRACION DE IMAGENES
**Prioridad:** MEDIA | **Duracion estimada:** 30 min
**Impacto:** Infraestructura - evitar perdida de fotos si Hostinger se cancela

#### Front: Ninguno

#### Backend:
| # | Tarea | Archivo/Donde | Detalle |
|---|-------|---------------|---------|
| 5.1 | Descargar imagenes de Hostinger | Script local | Descargar las 11 imagenes del sitio original |
| 5.2 | Subir a Supabase Storage | Supabase > Storage > property-images | Subir al bucket property-images |
| 5.3 | Actualizar URLs en DB | Supabase DB | UPDATE property_images SET url = nueva_url_supabase |

#### DB:
| # | Tarea | Tabla | Detalle |
|---|-------|-------|---------|
| 5.4 | Verificar bucket existe | Supabase Storage | Crear bucket property-images si no existe |
| 5.5 | Configurar RLS del bucket | Supabase Storage | Policies para lectura publica y escritura autenticada |

---

### FASE 6: STRIPE (Pasarela de Pago)
**Prioridad:** MEDIA | **Duracion estimada:** 1 sesion
**Dependencia:** Cliente debe crear cuenta Stripe primero

#### Front:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 6.1 | Boton "Inscribirse" funcional | src/features/trainings/components/ | Redirigir a Stripe Checkout |
| 6.2 | Pagina de exito | src/app/(main)/stripe-success/page.tsx | Mejorar pagina de confirmacion de pago |
| 6.3 | Pagina de cancelacion | src/app/(main)/stripe-cancel/page.tsx | Mejorar pagina de cancelacion |

#### Backend:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 6.4 | Crear Checkout Session | src/features/trainings/services/ | Server action para crear session de Stripe |
| 6.5 | Implementar webhook | src/app/api/webhooks/stripe/route.ts | Verificar firma, procesar checkout.session.completed |
| 6.6 | Registrar enrollment | src/features/trainings/services/ | Al pagar, crear registro en training_enrollments |

#### DB:
| # | Tarea | Tabla | Detalle |
|---|-------|-------|---------|
| 6.7 | Agregar stripe_session_id | training_enrollments | Para idempotencia del webhook |
| 6.8 | Agregar campos de pago | training_enrollments | amount_paid, currency, payment_date |

---

### FASE 7: RESEND (Emails Transaccionales)
**Prioridad:** BAJA | **Duracion estimada:** 1 sesion
**Dependencia:** Verificar dominio en Resend

#### Front: Ninguno

#### Backend:
| # | Tarea | Archivo | Detalle |
|---|-------|---------|---------|
| 7.1 | Crear servicio de email | src/shared/lib/email.ts | Funcion para enviar emails con Resend |
| 7.2 | Email al asesor cuando hay lead | src/features/contact/services/submit-inquiry.ts | Enviar email al asesor cuando alguien contacta por su propiedad |
| 7.3 | Email de bienvenida | src/features/auth/ | Email de bienvenida al registrarse |
| 7.4 | Email de confirmacion de pago | src/features/trainings/ | Email al pagar capacitacion |

#### DB: Ninguno

---

### FASE 8: DOMINIO Y PRODUCCION
**Prioridad:** BAJA | **Duracion estimada:** 30 min
**Dependencia:** Cliente paga Vercel Pro ($20/mes)

#### Config:
| # | Tarea | Donde | Detalle |
|---|-------|-------|---------|
| 8.1 | Upgrade Vercel Pro | Vercel Dashboard | Cliente paga $20/mes |
| 8.2 | Agregar dominio | Vercel > Settings > Domains | chiclayopropiedades.com + www |
| 8.3 | Configurar DNS | Hostinger | A: 76.76.21.21, CNAME www: cname.vercel-dns.com |
| 8.4 | Actualizar URLs | Vercel + Supabase | NEXT_PUBLIC_APP_URL y Site URL a chiclayopropiedades.com |
| 8.5 | SSL automatico | Vercel | Vercel lo maneja automaticamente |

---

### FASE 9: MEJORAS OPCIONALES (V2.0+)
**Prioridad:** BAJA | **Duracion estimada:** Varias sesiones

| # | Tarea | Tipo | Detalle |
|---|-------|------|---------|
| 9.1 | Mapa Leaflet | Front | Mapa interactivo en detalle de propiedad (lat/lng ya existen en DB) |
| 9.2 | Revision visual | Front | Comparar pagina por pagina con el original y ajustar |
| 9.3 | Notificaciones push | Front+Back | Notificar al asesor en tiempo real cuando llega un lead |
| 9.4 | Dashboard analytics | Front+Back | Graficas de leads por mes, propiedades por tipo, etc. |
| 9.5 | Busqueda avanzada | Front | Filtros por mapa, rango de area, antiguedad |
| 9.6 | Favoritos | Front+Back+DB | Usuarios guardan propiedades favoritas |
| 9.7 | Comparador | Front | Comparar 2-3 propiedades lado a lado |
| 9.8 | Chat en vivo | Front+Back | Chat entre comprador y asesor |

---

## RESUMEN EJECUTIVO

| Fase | Nombre | Prioridad | Tipo | Dependencia |
|------|--------|-----------|------|-------------|
| 1 | Frontend Premium | ALTA | Front | Ninguna |
| 2 | Configuraciones Urgentes | CRITICA | Config | Ninguna |
| 3 | Limpieza de Datos | ALTA | DB | Ninguna |
| 4 | Ranking por Ventas | ALTA | Full-stack | Ninguna |
| 5 | Migracion Imagenes | MEDIA | Back+DB | Ninguna |
| 6 | Stripe | MEDIA | Full-stack | Cliente crea cuenta |
| 7 | Resend | BAJA | Back | Verificar dominio |
| 8 | Dominio | BAJA | Config | Vercel Pro pagado |
| 9 | Mejoras V2.0+ | BAJA | Full-stack | Todas las anteriores |

**Orden recomendado de ejecucion:** 2 -> 1 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9

---

## STACK TECNOLOGICO

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI | React + TypeScript | 19.2.4 / 5 |
| Estilos | Tailwind CSS | 4 |
| Componentes | shadcn/ui (base-nova) | Latest |
| Animaciones | Motion (Framer Motion) | A instalar |
| Auth | Supabase Auth | Latest |
| Database | Supabase (PostgreSQL) | Latest |
| Storage | Supabase Storage | Latest |
| Pagos | Stripe | Pendiente |
| Emails | Resend | Pendiente |
| Deploy | Vercel | Hobby -> Pro |
| Icons | Lucide React | Latest |
| Validacion | Zod | Latest |
| Testing | Jest + Playwright | Latest |

---

## ARQUITECTURA

```
src/
├── app/
│   ├── (auth)/           # Login, Signup, Recovery, Verify
│   ├── (main)/           # Paginas publicas (Home, Propiedades, Blog, etc.)
│   ├── admin/            # Panel de administracion (11 paginas)
│   ├── dashboard/        # Dashboard del agente (8 paginas)
│   └── api/              # Auth callback + Stripe webhook
├── features/
│   ├── admin/            # CRUD admin + ranking recalc
│   ├── auth/             # Formularios de auth
│   ├── blog/             # Blog fetch + tipos
│   ├── contact/          # Formulario de contacto + submit
│   ├── dashboard/        # Stats + perfil
│   ├── properties/       # CRUD propiedades + filtros
│   ├── ranking/          # Rankings fetch + tipos
│   ├── services/         # Servicios fetch + tipos
│   └── trainings/        # Capacitaciones fetch + tipos
└── shared/
    ├── components/       # UI (shadcn) + Layout (Header, Footer, WhatsApp)
    ├── lib/              # Supabase clients, utils, format, structured-data
    └── types/            # Tipos compartidos
```

---

## BASE DE DATOS (9 tablas actuales + cambios planeados)

```
profiles          -> Usuarios (user, agent, admin)
properties        -> Propiedades (+ status, sale_price, sale_date en Fase 4)
property_images   -> Fotos de propiedades
inquiries         -> Leads/consultas
blog_posts        -> Articulos del blog
trainings         -> Capacitaciones/cursos
training_enrollments -> Inscripciones (+ campos Stripe en Fase 6)
services          -> Servicios ofrecidos
agent_rankings    -> Ranking de agentes (+ sales_count, total_sales en Fase 4)
```
