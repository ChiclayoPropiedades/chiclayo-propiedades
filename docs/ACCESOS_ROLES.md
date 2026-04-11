# ACCESOS POR ROL - Chiclayo Propiedades

**URL Producción:** https://chiclayo-propiedades.vercel.app
**Última actualización:** 11 Abril 2026

---

## CREDENCIALES DE PRUEBA

| Rol | Email | Password | Nombre |
|-----|-------|----------|--------|
| **Superadmin** | test@chiclayopropiedades.com | Test1234! | Test Admin Chiclayo |
| **Superadmin** | casagrandegrupoinmobiliario@gmail.com | (la de la dueña) | Maired |
| **Agente** | agente@chiclayopropiedades.com | Agente1234! | Carlos Mendoza Rivera |
| **Agente** | (registrado manualmente) | — | Jorge Luis Silva Laredo |
| **Comprador (user)** | comprador@chiclayopropiedades.com | Comprador1234! | María López Torres |

---

## SUPERADMIN (Propietario de la plataforma)

**Acceso:** Control total. Ve y gestiona TODO.
**Credenciales:** test@chiclayopropiedades.com / Test1234!
**Redirige después del login a:** `/admin`

### Sidebar del Superadmin (Desktop)
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Dashboard | `/admin` | Métricas: usuarios, propiedades, leads, finanzas + gráficas (Recharts) |
| Usuarios | `/admin/usuarios` | Crear, editar roles, activar/desactivar, ver detalle (propiedades/leads/ventas) |
| Propiedades | `/admin/propiedades` | Ver todas (cards con fotos + tabla), editar, eliminar, destacar |
| Leads | `/admin/leads` | Ver todas las consultas, cambiar estado |
| Blog | `/admin/blog` | Crear, editar (lápiz), eliminar artículos (con upload de imágenes, markdown) |
| Capacitaciones | `/admin/capacitaciones` | Crear, editar (lápiz), eliminar cursos (con upload de portada, markdown) |
| Servicios | `/admin/servicios` | Editar servicios de la web |
| Ranking | `/admin/ranking` | Aprobar/rechazar ventas, recalcular ranking |
| Finanzas | `/admin/finanzas` | Ingresos totales, comisiones, ventas detalladas, suscripciones (activar/desactivar/extender) |
| Configuración | `/admin/configuracion` | Comisión %, tasa USD/PEN, precio suscripción, WhatsApp pago, emails (Brevo/Gmail), pasarelas |
| Mi Perfil | `/dashboard/perfil` | Editar datos personales, foto de perfil |

### Navegación Mobile del Superadmin
- 10 tabs scrollables horizontalmente en la parte superior
- Mismo acceso que desktop, optimizado para pantallas < 400px

### Acciones exclusivas del superadmin:
- **Crear usuarios** desde el panel (email, nombre, rol, teléfono)
- **Aprobar/rechazar ventas** de los agentes
- **Activar suscripciones manualmente** desde Finanzas (extender por horas/días/meses/años)
- **Desactivar suscripciones** activas de agentes
- **Configurar precio de suscripción anual** para agentes
- **Configurar comisión %** sobre ventas
- **Publicar propiedades sin suscripción** (no tiene restricción)
- **Habilitar/deshabilitar suscripción gratis** (toggle en configuración)
- **Configurar WhatsApp como método de pago** (número, mensaje, toggle)
- **Configurar emails transaccionales** (Brevo o Gmail API, desde el panel)
- **Enviar email de prueba** para verificar la conexión

### Flujo de aprobación de ventas:
1. Agente marca propiedad como "vendida" con precio de venta
2. Aparece en **Ranking > "Ventas pendientes de aprobación"**
3. Admin verifica documentos (presencial o WhatsApp)
4. Admin aprueba → comisión se calcula automáticamente → ranking se recalcula
5. Se ve en **Finanzas** con todo el detalle

### Configuración de pagos (desde /admin/configuracion):
| Opción | Descripción | Estado |
|--------|-------------|--------|
| Suscripción gratis | Agentes se auto-activan sin pagar | Toggle ✅/❌ |
| Pago por WhatsApp | Redirige a wa.me con mensaje predeterminado | Toggle ✅/❌, número y mensaje editables |
| MercadoPago | Pasarela principal (Peru) | Variables en Vercel |
| Stripe | Pasarela alternativa | Variables en Vercel |

### Configuración de emails (desde /admin/configuracion):
| Proveedor | Límite gratis | Configuración |
|-----------|--------------|---------------|
| Brevo | 300 emails/día | API Key + email remitente (desde el panel) |
| Gmail API | 500 emails/día | Client ID + Secret + Refresh Token (desde el panel) |

---

## AGENTE / ASESOR INMOBILIARIO

**Acceso:** `/dashboard` (funcionalidad limitada a sus propios datos)
**Credenciales:** agente@chiclayopropiedades.com / Agente1234!
**Rol en DB:** `agent`
**Redirige después del login a:** `/dashboard`

### Sidebar del Agente
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Resumen | `/dashboard` | Stats personales: propiedades, consultas, capacitaciones + estado suscripción |
| Mis Propiedades | `/dashboard/propiedades` | Ver SUS propiedades publicadas con fotos, badges estado |
| Mis Consultas | `/dashboard/leads` | Ver leads recibidos por sus propiedades |
| Mi Perfil | `/dashboard/perfil` | Editar nombre, teléfono, bio, foto (responsive en móvil) |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver cursos inscritos |

### Suscripción anual (OBLIGATORIA para publicar):
- **Precio:** S/ 99/año (configurable por admin)
- Al intentar crear propiedad sin suscripción → ve pantalla de suscripción
- **3 métodos de pago posibles** (según lo que el admin tenga configurado):
  1. **WhatsApp** → redirige a wa.me con mensaje "Quiero pagar mi suscripción"
  2. **MercadoPago** → redirige a Checkout Pro
  3. **Stripe** → redirige a Stripe Checkout
  4. **Gratis** → auto-activación por 1 año (si admin lo habilita)
- Si ningún método está configurado → ve "Contacta al administrador"

### Acciones del agente:
- **Publicar propiedades** (solo con suscripción activa) con fotos (drag & drop, URL, file picker)
- **Editar/eliminar** solo SUS propiedades
- **Marcar propiedad como vendida** → ingresa precio real → queda pendiente de aprobación
- **Aparecer en ranking** basado en monto total de ventas aprobadas
- **Recibir leads** cuando compradores contactan por sus propiedades
- **Recibir emails** de notificación de leads (si email está configurado)
- **Inscribirse en capacitaciones** y pagar (MercadoPago o Stripe)

### NO puede:
- Ver propiedades de otros agentes
- Aprobar ventas
- Acceder al panel admin
- Crear usuarios
- Publicar sin suscripción activa

---

## COMPRADOR / USUARIO REGISTRADO

**Acceso:** `/dashboard` (funcionalidad muy limitada)
**Credenciales:** comprador@chiclayopropiedades.com / Comprador1234!
**Rol en DB:** `user`
**Redirige después del login a:** `/dashboard`

### Sidebar del Usuario
| Sección | Ruta | Qué puede hacer |
|---------|------|-----------------|
| Resumen | `/dashboard` | Stats básicos |
| Mis Propiedades | `/dashboard/propiedades` | Vacío (no puede publicar) |
| Mis Consultas | `/dashboard/leads` | Vacío |
| Mi Perfil | `/dashboard/perfil` | Editar datos personales, foto |
| Mis Capacitaciones | `/dashboard/capacitaciones` | Ver cursos pagados |

### Acciones del comprador:
- **Editar su perfil** (nombre, teléfono, bio, foto)
- **Ver capacitaciones** en las que se inscribió
- **Inscribirse en cursos** y pagar (MercadoPago o Stripe)
- **Recibe email de bienvenida** al registrarse

### NO puede:
- Publicar propiedades
- Ver leads
- Marcar ventas
- Para publicar → admin debe promoverlo a `agent`

---

## VISITANTE (No registrado)

**Acceso:** Solo páginas públicas (no requiere login)

| Página | Ruta | Qué puede hacer |
|--------|------|-----------------|
| Home | `/` | Hero, propiedades destacadas, ranking, capacitaciones, blog, newsletter |
| Propiedades | `/propiedades` | Buscar con filtros (tipo, precio, ubicación, operación) |
| Detalle Propiedad | `/propiedades/[slug]` | Fotos, datos, ubicación, contactar asesor (formulario + WhatsApp) |
| Blog | `/blog` | Artículos con markdown renderizado |
| Detalle Blog | `/blog/[slug]` | Artículo completo con headings, listas, negritas |
| Capacitaciones | `/capacitaciones` | Catálogo de cursos |
| Detalle Capacitación | `/capacitaciones/[slug]` | Detalles, precio, inscribirse (MercadoPago/Stripe) |
| Ranking | `/ranking` | Ranking de asesores por ventas cerradas |
| Servicios | `/servicios` | Servicios ofrecidos |
| Contacto | `/contacto` | Formulario de consulta (envía email al agente si está configurado) |
| Privacidad | `/privacidad` | Política de privacidad |
| Términos | `/terminos` | Términos de servicio |

### Acciones:
- **Contactar asesor** por formulario o WhatsApp
- **Registrarse** como usuario o agente en `/signup`
- **Recibe email de bienvenida** al registrarse

---

## AUTH (Autenticación)

| Página | Ruta | Función |
|--------|------|---------|
| Login | `/login` | Iniciar sesión (admin → `/admin`, otros → `/dashboard`) |
| Registro | `/signup` | Crear cuenta (elige: Vendedor/Comprador o Agente Inmobiliario) |
| Recuperar contraseña | `/password-recovery` | Solicitar reset por email |
| Verificar email | `/verify-email` | Confirmar registro (email de Supabase en español) |

---

## PROTECCIÓN DE RUTAS

| Ruta | Requiere login | Requiere rol |
|------|---------------|-------------|
| `/` (home y públicas) | ❌ | — |
| `/login`, `/signup` | ❌ (redirige si ya logueado) | — |
| `/dashboard/*` | ✅ | user, agent, o admin |
| `/admin/*` | ✅ | solo admin |

---

## FLUJO DE DINERO

| Ingreso | Cómo funciona | Cobro |
|---------|---------------|-------|
| **Suscripción agente** | S/99/año para publicar propiedades | WhatsApp manual / MercadoPago / Stripe / Gratis (configurable) |
| **Comisión por venta** | 5% sobre precio de venta aprobada (configurable) | Manual (fuera de plataforma) |
| **Capacitaciones** | Usuario paga curso online | MercadoPago / Stripe |
| **Servicios B2B** | Empresa contacta por WhatsApp | Manual |

---

## EMAILS AUTOMÁTICOS

| Evento | Email enviado | A quién |
|--------|--------------|---------|
| Nuevo lead por formulario | Notificación con datos del lead | Al agente dueño de la propiedad |
| Registro de usuario | Email de bienvenida | Al usuario que se registró |
| Pago de capacitación | Confirmación con detalles del curso | Al usuario que pagó |
| Activación de suscripción | Confirmación con fecha de expiración | Al agente |

**Proveedores:** Brevo (300/día gratis) o Gmail API (500/día gratis), configurables desde admin.

---

## PASARELAS DE PAGO

| Pasarela | Uso | Estado |
|----------|-----|--------|
| **WhatsApp (manual)** | Agente contacta, admin cobra y activa | ✅ Funcional, configurable |
| **MercadoPago** | Checkout Pro automático (Peru) | ⏳ Esperando cuenta del cliente |
| **Stripe** | Checkout alternativo | ⏳ Esperando cuenta del cliente |

---

## BASE DE DATOS (12 tablas)

| Tabla | Registros | Descripción |
|-------|-----------|-------------|
| profiles | 5 | Usuarios (user, agent, admin) |
| properties | 5 | Propiedades inmobiliarias (con status, sale_price) |
| property_images | 5 | Fotos de propiedades |
| inquiries | 0 | Leads/consultas de compradores |
| blog_posts | 1 | Artículos del blog (markdown) |
| trainings | 1 | Capacitaciones/cursos (markdown) |
| training_enrollments | — | Inscripciones a cursos (Stripe + MP + WhatsApp) |
| services | 10 | Servicios ofrecidos |
| agent_rankings | 2 | Ranking por ventas cerradas |
| agent_subscriptions | 1 | Suscripciones de agentes (Stripe + MP + manual) |
| platform_settings | 15 | Configuración de la plataforma (comisiones, email, WhatsApp, etc.) |
| role_upgrade_requests | — | Solicitudes de migracion de rol (user→agent, aprobacion admin) |

---

## STACK TECNOLÓGICO

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.2.2 (App Router) |
| UI | React 19 + TypeScript 5 |
| Estilos | Tailwind CSS 4 + @tailwindcss/typography |
| Componentes | shadcn/ui (base-nova) |
| Animaciones | Motion (Framer Motion) |
| Markdown | react-markdown |
| Gráficas | Recharts |
| Auth | Supabase Auth (Email/Password) |
| Database | Supabase (PostgreSQL) + RLS |
| Storage | Supabase Storage (3 buckets) |
| Pagos | MercadoPago Checkout Pro + Stripe |
| Emails | Brevo API / Gmail OAuth2 |
| Deploy | Vercel (auto con git push) |

---

**Middleware:** `src/middleware.ts` verifica JWT en cada request y redirige según corresponda.
**Última actualización:** 11 Abril 2026
